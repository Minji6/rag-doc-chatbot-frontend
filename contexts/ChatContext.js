"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import chatApi from "@/apis/chatApi"

const ChatContext = createContext(null)

export function ChatContextProvider({ children }) {
    const { currentUser } = useAuth()

    const [conversations, setConversations]     = useState([])
    const [conversationId, setConversationId]   = useState(() => crypto.randomUUID())
    const [messages, setMessages]               = useState([])
    const [loading, setLoading]                 = useState(false)

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
    }, [currentUser?.user_id])

    const handleNewChat = () => {
        setMessages([])
        setConversationId(crypto.randomUUID())
    }

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

            // user인 경우 대화 목록 갱신 (새 대화라면 추가 — title은 백엔드 생성 후 다음 조회 시 반영)
            if (currentUser) {
                setConversations(prev => {
                    const exists = prev.some(c => c.conversation_id === newConvId)
                    if (exists) return prev
                    return [{ conversation_id: newConvId }, ...prev]
                })
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
            setConversations(prev => prev.filter(c => c.conversation_id !== targetConversationId))
            if (conversationId === targetConversationId) handleNewChat()
        } catch (err) {
            console.error("대화 삭제 실패", err)
        }
    }, [currentUser, conversationId])

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
