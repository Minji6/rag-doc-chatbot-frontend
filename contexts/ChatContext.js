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

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [conversations, setConversations]     = useState([])
    const [conversationId, setConversationId]   = useState(() => crypto.randomUUID())
    const [messages, setMessages]               = useState([])
    const [loading, setLoading]                 = useState(false)

    const handleNewChat = useCallback(() => {
        setMessages([])
        setConversationId(crypto.randomUUID())
    }, [])

    // currentUser가 바뀌면 대화 목록 새로 로드.
    // 게스트는 백엔드가 InMemorySaver(휘발성)로 설계 → 목록 없음(새로고침 시 소멸).
    // 유저는 백엔드 목록(conversation_id)에 캐시된 제목을 보강한다.
    useEffect(() => {
        let cancelled = false
        handleNewChat()
        if (!currentUser) {
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

    // 사이드바에서 대화방 선택 시 히스토리 로드 (유저 전용 — 게스트는 목록 자체가 없음).
    const handleSelectChat = useCallback(async (selectedConversationId) => {
        if (!currentUser) return
        latestSelectRef.current = selectedConversationId
        setConversationId(selectedConversationId)
        try {
            const res = await chatApi.getHistory(
                selectedConversationId, "user", String(currentUser.user_id)
            )
            // 그 사이 다른 대화방을 선택했다면 이 응답은 버린다.
            if (latestSelectRef.current !== selectedConversationId) return
            const loaded = res.data.messages.map(m => ({
                role: m.role === "human" ? "user" : "bot",
                content: m.content,
            }))
            setMessages(loaded)
        } catch (err) {
            console.error("대화 기록 로드 실패", err)
        }
    }, [currentUser])

    const handleSend = useCallback(async (text) => {
        if (!text.trim() || loading) return

        const role   = currentUser ? "user" : "guest"
        const userId = currentUser ? String(currentUser.user_id) : null

        setMessages(prev => [...prev, { role: "user", content: text }])
        setLoading(true)

        try {
            const res = await chatApi.sendChat(text, conversationId, role, userId)
            const newConvId = res.data.conversation_id
            setConversationId(newConvId)
            setMessages(prev => [...prev, {
                role:         "bot",
                content:      res.data.message,
                category:     res.data.category     ?? [],
                inquiry_type: res.data.inquiry_type ?? "",
                policies:     res.data.policies     ?? [],
            }])

            // 유저만 사이드바 목록·제목을 갱신. 게스트는 휘발성이라 목록을 만들지 않는다.
            if (currentUser) {
                const title = deriveTitle(text)
                rememberTitle(currentUser.user_id, newConvId, title)
                setConversations(prev => upsertConversation(prev, newConvId, title))
            }
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, {
                role: "bot",
                content: "서버 연결에 실패했습니다. 백엔드를 확인해주세요.",
            }])
        } finally {
            setLoading(false)
        }
    }, [currentUser, conversationId, loading])

    const handleDeleteChat = useCallback(async (targetConversationId) => {
        if (!currentUser) return
        try {
            await chatApi.clearHistory(targetConversationId, "user", String(currentUser.user_id))
            forgetTitle(currentUser.user_id, targetConversationId)
            setConversations(prev => prev.filter(c => c.conversation_id !== targetConversationId))
            if (conversationId === targetConversationId) handleNewChat()
        } catch (err) {
            console.error("대화 삭제 실패", err)
        }
    }, [currentUser, conversationId, handleNewChat])

    return (
        <ChatContext.Provider value={{
            conversations,
            conversationId,
            messages,
            loading,
            handleNewChat,
            handleSelectChat,
            handleSend,
            handleDeleteChat,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    return useContext(ChatContext)
}
