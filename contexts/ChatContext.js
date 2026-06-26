"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import chatApi from "@/apis/chatApi"

const ChatContext = createContext(null)

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [conversations, setConversations]   = useState([])
    const [conversationId, setConversationId] = useState(() => crypto.randomUUID())
    const [messages, setMessages]             = useState([])
    const [loading, setLoading]               = useState(false)
    const [error, setError]                   = useState(null)

    const handleNewChat = useCallback(() => {
        setMessages([])
        setConversationId(crypto.randomUUID())
        setError(null)
    }, [])

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

    const handleSelectChat = useCallback(async (selectedConversationId) => {
        if (!currentUser) return
        setConversationId(selectedConversationId)
        setError(null)
        try {
            const res = await chatApi.getHistory(
                selectedConversationId, "user", String(currentUser.user_id)
            )
            const loaded = res.data.messages.map(m => ({
                role: m.role === "human" ? "user" : "bot",
                content: m.content,
            }))
            setMessages(loaded)
        } catch (err) {
            console.error("대화 기록 로드 실패", err)
            setError("대화 기록을 불러오지 못했습니다.")
        }
    }, [currentUser])

    const handleSend = useCallback(async (text, attach = null) => {
        if (!text.trim() || loading) return

        const role   = currentUser ? "user" : "guest"
        const userId = currentUser ? String(currentUser.user_id) : null

        setMessages(prev => [...prev, { role: "user", content: text }])
        setLoading(true)
        setError(null)

        try {
            const res = await chatApi.sendChat(text, conversationId, role, userId, attach)
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

            if (currentUser) {
                setConversations(prev => {
                    const exists = prev.some(c => c.conversation_id === newConvId)
                    if (exists) return prev
                    return [{ conversation_id: newConvId }, ...prev]
                })
            }
        } catch (err) {
            console.error(err)
            const msg = err.response?.data?.detail ?? "서버 연결에 실패했습니다. 백엔드를 확인해주세요."
            setError(msg)
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
