"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import chatApi from "@/apis/chatApi"
import { withTitles, deriveTitle, rememberTitle, forgetTitle } from "@/utils/conversationStore"

const ChatContext = createContext(null)

/** 대화 1건을 목록 맨 앞으로 끌어올린다. 기존 제목은 보존(첫 질문 기준 유지). */
function upsertConversation(conversations, conversationId, title) {
    const existing = conversations.find(c => c.conversation_id === conversationId)
    const rest = conversations.filter(c => c.conversation_id !== conversationId)
    return [{ conversation_id: conversationId, title: existing?.title ?? title }, ...rest]
}

/** 메시지 목록에 들어있는 첨부 미리보기 blob URL을 해제한다. */
function revokeMessageImages(messages) {
    messages.forEach(m => {
        if (typeof m.image === "string" && m.image.startsWith("blob:")) {
            URL.revokeObjectURL(m.image)
        }
    })
}

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [conversations, setConversations]   = useState([])
    const [conversationId, setConversationId] = useState(() => crypto.randomUUID())
    const [messages, setMessages]             = useState([])
    const [loading, setLoading]               = useState(false)
    const [error, setError]                   = useState(null)

    const handleNewChat = useCallback(() => {
        setMessages(prev => { revokeMessageImages(prev); return [] })
        setConversationId(crypto.randomUUID())
        setError(null)
    }, [])

    // 언마운트 시 남아있는 첨부 미리보기 URL 정리
    useEffect(() => {
        return () => setMessages(prev => { revokeMessageImages(prev); return prev })
    }, [])

    // currentUser가 바뀌면(로그인/로그아웃) 대화 목록을 새로 로드한다.
    // 게스트는 백엔드가 InMemorySaver(휘발성)로 설계 → 영속 목록이 없으므로,
    //   사이드바 목록을 이 React state(conversations)에만 들고 있는다.
    //   세션 중에는 유지되고, 새로고침하면 state가 초기화되어 자연히 사라진다(설계 의도와 일치).
    // 유저는 백엔드 목록(conversation_id)에 캐시된 제목을 보강한다.
    useEffect(() => {
        let cancelled = false
        handleNewChat()
        if (!currentUser) {
            // 로그아웃 직후엔 직전 유저의 목록을 비운다.
            // (게스트 세션 중 쌓인 목록은 currentUser가 계속 없으므로 이 effect가 다시 돌지 않아 보존된다.)
            setConversations([])
            return
        }
        chatApi.getConversations(currentUser.user_id)
            .then(res => { if (!cancelled) setConversations(withTitles(currentUser.user_id, res.data)) })
            .catch(err => console.error("대화 목록 조회 실패", err))
        // 유저가 빠르게 바뀌면 이전 요청의 응답이 늦게 도착해 새 상태를 덮어쓰는 것을 방지
        return () => { cancelled = true }
    }, [currentUser?.user_id, handleNewChat])

    // 가장 최근에 선택된 대화방 id. 빠른 연속 클릭 시 늦게 도착한 응답이
    // 다른 대화의 메시지를 덮어쓰지 않도록, 응답 반영 전에 이 값과 대조한다.
    const latestSelectRef = useRef(null)

    // 사이드바에서 대화방 선택 시 히스토리 로드.
    // 게스트도 백엔드가 conversation_id로 get-history를 지원하므로 동일하게 동작한다
    // (서버 메모리가 살아있는 동안만 — 세션 중 선택/복원 용도).
    const handleSelectChat = useCallback(async (selectedConversationId) => {
        latestSelectRef.current = selectedConversationId
        setConversationId(selectedConversationId)
        setError(null)
        const role   = currentUser ? "user" : "guest"
        const userId = currentUser ? String(currentUser.user_id) : null
        try {
            const res = await chatApi.getHistory(selectedConversationId, role, userId)
            // 그 사이 다른 대화방을 선택했다면 이 응답은 버린다.
            if (latestSelectRef.current !== selectedConversationId) return
            const loaded = res.data.messages.map(m => ({
                role: m.role === "human" ? "user" : "bot",
                content: m.content,
            }))
            setMessages(prev => { revokeMessageImages(prev); return loaded })
        } catch (err) {
            console.error("대화 기록 로드 실패", err)
            setError("대화 기록을 불러오지 못했습니다.")
        }
    }, [currentUser])

    // 전송 성공 여부(boolean)를 반환한다 — 호출부가 실패 시 입력/첨부를 복원할 수 있도록.
    const handleSend = useCallback(async (text, attach = null) => {
        // 텍스트가 비어도 이미지가 있으면 전송 허용 (이미지 단독 질의)
        if ((!text.trim() && !attach) || loading) return false

        const role   = currentUser ? "user" : "guest"
        const userId = currentUser ? String(currentUser.user_id) : null

        // 이미지만 보낼 때도 백엔드 분석이 동작하도록 기본 질의를 채운다
        const apiMessage = text.trim() || "첨부한 이미지를 분석해 주세요"
        // 유저 말풍선에 보여줄 첨부 미리보기 (브라우저 메모리 URL)
        const imagePreview = attach ? URL.createObjectURL(attach) : null

        setMessages(prev => [...prev, { role: "user", content: text.trim(), image: imagePreview }])
        setLoading(true)
        setError(null)

        try {
            const res = await chatApi.sendChat(apiMessage, conversationId, role, userId, attach)
            const data = res.data
            const newConvId = data.conversation_id
            setConversationId(newConvId)
            setMessages(prev => [...prev, {
                role:         "bot",
                content:      data.message,
                category:     data.category     ?? [],
                inquiry_type: data.inquiry_type ?? "",
                policies:     data.policies     ?? [],
                suggestions:  data.suggestions  ?? [],
            }])

            // 사이드바 목록을 갱신한다. 게스트도 React state(인메모리)에는 쌓아
            // 세션 중 사이드바에 노출하되, 제목 캐시(localStorage)는 유저만 영속화한다.
            const title = deriveTitle(text)
            if (currentUser) {
                rememberTitle(currentUser.user_id, newConvId, title)
            }
            setConversations(prev => upsertConversation(prev, newConvId, title))
            return true
        } catch (err) {
            const serverDetail = err.response?.data?.detail ?? err.response?.data?.message
            console.error("sendChat 실패:", err.response?.status, serverDetail ?? err.message)
            const msg = serverDetail ?? "서버 연결에 실패했습니다. 백엔드를 확인해주세요."
            setError(msg)
            return false
        } finally {
            setLoading(false)
        }
    }, [currentUser, conversationId, loading])

    const handleDeleteChat = useCallback(async (targetConversationId) => {
        const role   = currentUser ? "user" : "guest"
        const userId = currentUser ? String(currentUser.user_id) : null
        try {
            await chatApi.clearHistory(targetConversationId, role, userId)
            if (currentUser) forgetTitle(currentUser.user_id, targetConversationId)
            setConversations(prev => prev.filter(c => c.conversation_id !== targetConversationId))
            if (conversationId === targetConversationId) handleNewChat()
        } catch (err) {
            console.error("대화 삭제 실패", err)
        }
    }, [currentUser, conversationId, handleNewChat])

    const clearError = useCallback(() => setError(null), [])

    return (
        <ChatContext.Provider value={{
            conversations,
            conversationId,
            messages,
            loading,
            error,
            handleNewChat,
            handleSelectChat,
            handleSend,
            handleDeleteChat,
            clearError,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    return useContext(ChatContext)
}
