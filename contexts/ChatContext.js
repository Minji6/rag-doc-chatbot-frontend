"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import chatApi from "@/apis/chatApi"

const ChatContext = createContext(null)

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

    const [conversations, setConversations]     = useState([])
    const [conversationId, setConversationId]   = useState(() => crypto.randomUUID())
    const [messages, setMessages]               = useState([])
    const [loading, setLoading]                 = useState(false)

    const handleNewChat = useCallback(() => {
        setMessages(prev => { revokeMessageImages(prev); return [] })
        setConversationId(crypto.randomUUID())
    }, [])

    // 언마운트 시 남아있는 첨부 미리보기 URL 정리
    useEffect(() => {
        return () => setMessages(prev => { revokeMessageImages(prev); return prev })
    }, [])

    // currentUser가 바뀌면 대화 목록 새로 로드
    useEffect(() => {
        if (!currentUser) {
            setConversations([])
            handleNewChat()
            return
        }
        chatApi.getConversations(currentUser.user_id)
            .then(res => setConversations(res.data))
            .catch(err => console.error("대화 목록 조회 실패", err))

        handleNewChat()
    }, [currentUser?.user_id, handleNewChat])

    // 사이드바에서 대화방 선택 시 히스토리 로드
    const handleSelectChat = useCallback(async (selectedConversationId) => {
        if (!currentUser) return
        setConversationId(selectedConversationId)
        try {
            const res = await chatApi.getHistory(
                selectedConversationId, "user", String(currentUser.user_id)
            )
            const loaded = res.data.messages.map(m => ({
                role: m.role === "human" ? "user" : "bot",
                content: m.content,
            }))
            setMessages(prev => { revokeMessageImages(prev); return loaded })
        } catch (err) {
            console.error("대화 기록 로드 실패", err)
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

        try {
            const res = await chatApi.sendChat(apiMessage, conversationId, role, userId, attach)
            const newConvId = res.data.conversation_id
            setConversationId(newConvId)
            setMessages(prev => [...prev, {
                role:         "bot",
                content:      res.data.message,
                category:     res.data.category     ?? [],
                inquiry_type: res.data.inquiry_type ?? "",
                policies:     res.data.policies     ?? [],
            }])

            // user인 경우 대화 목록 갱신 (새 대화라면 추가 — title은 백엔드 생성 후 다음 조회 시 반영)
            if (currentUser) {
                setConversations(prev => {
                    const exists = prev.some(c => c.conversation_id === newConvId)
                    if (exists) return prev
                    return [{ conversation_id: newConvId }, ...prev]
                })
            }
            return true
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, {
                role: "bot",
                content: "서버 연결에 실패했습니다. 백엔드를 확인해주세요.",
            }])
            return false
        } finally {
            setLoading(false)
        }
    }, [currentUser, conversationId, loading])

    const handleDeleteChat = useCallback(async (targetConversationId) => {
        if (!currentUser) return
        try {
            await chatApi.clearHistory(targetConversationId, "user", String(currentUser.user_id))
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
