"use client"

import { createContext, useContext, useState, useCallback } from "react"
import chatApi from "@/apis/chatApi"
import { useAuth } from "@/contexts/AuthContext"

const ChatContext = createContext(null)

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [conversations, setConversations] = useState([])   // { id, title, group }
    const [activeId, setActiveId]           = useState(null)
    const [messages, setMessages]           = useState([])   // { role, content, category, inquiry_type, policies }
    const [conversationId, setConversationId] = useState(() => crypto.randomUUID())
    const [loading, setLoading]             = useState(false)
    const [error, setError]                 = useState(null)

    const role    = currentUser ? "user" : "guest"
    const userId  = currentUser?.user_id ?? null

    // 메시지 전송
    const sendMessage = useCallback(async (text, attach = null) => {
        if (!text.trim() || loading) return

        const userMsg = { role: "user", content: text }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)
        setError(null)

        // 첫 메시지면 대화 목록에 추가
        setConversations(prev => {
            const exists = prev.find(c => c.id === conversationId)
            if (exists) return prev
            const isToday = true
            return [{ id: conversationId, title: text.slice(0, 20), group: isToday ? "today" : "lastWeek" }, ...prev]
        })
        setActiveId(conversationId)

        try {
            const res = await chatApi.sendChat(text, conversationId, role, userId, attach)
            const data = res.data
            setConversationId(data.conversation_id)
            setMessages(prev => [...prev, {
                role: "bot",
                content: data.message,
                category:     data.category     ?? [],
                inquiry_type: data.inquiry_type ?? "",
                policies:     data.policies     ?? [],
                suggestions:  data.suggestions  ?? [],
            }])
        } catch (err) {
            const msg = err.response?.data?.detail ?? "서버 연결에 실패했습니다. 백엔드를 확인해주세요."
            setError(msg)
        } finally {
            setLoading(false)
        }
    }, [loading, conversationId, role, userId])

    // 새 대화 시작
    const startNewChat = useCallback(() => {
        setMessages([])
        setConversationId(crypto.randomUUID())
        setActiveId(null)
        setError(null)
    }, [])

    // 대화 선택 (사이드바 클릭) - 현재는 로컬 상태만 변경
    const selectConversation = useCallback((id) => {
        setActiveId(id)
    }, [])

    // 에러 초기화
    const clearError = useCallback(() => setError(null), [])

    return (
        <ChatContext.Provider value={{
            conversations,
            activeId,
            messages,
            loading,
            error,
            sendMessage,
            startNewChat,
            selectConversation,
            clearError,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    return useContext(ChatContext)
}
