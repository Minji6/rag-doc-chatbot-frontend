"use client"

import { createContext, useContext, useState, useCallback } from "react"
import chatApi from "@/apis/chatApi"
import { useAuth } from "@/contexts/AuthContext"

const ChatContext = createContext(null)

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [messages, setMessages]               = useState([])
    const [conversationId, setConversationId]   = useState(() => crypto.randomUUID())
    const [loading, setLoading]                 = useState(false)
    const [error, setError]                     = useState(null)

    const role   = currentUser ? "user" : "guest"
    const userId = currentUser?.user_id ?? null

    const sendMessage = useCallback(async (text, attach = null) => {
        if (!text.trim() || loading) return

        setMessages(prev => [...prev, { role: "user", content: text }])
        setLoading(true)
        setError(null)

        try {
            const res = await chatApi.sendChat(text, conversationId, role, userId, attach)
            const data = res.data
            setConversationId(data.conversation_id)
            setMessages(prev => [...prev, {
                role:         "bot",
                content:      data.message,
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

    const startNewChat = useCallback(() => {
        setMessages([])
        setConversationId(crypto.randomUUID())
        setError(null)
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return (
        <ChatContext.Provider value={{
            messages,
            loading,
            error,
            sendMessage,
            startNewChat,
            clearError,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    return useContext(ChatContext)
}
