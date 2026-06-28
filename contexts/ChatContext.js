"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import chatApi from "@/apis/chatApi"
import {
    withTitles,
    deriveTitle,
    rememberTitle,
    loadGuestConversations,
    loadGuestMessages,
    saveGuestConversation,
    deleteGuestConversation,
} from "@/utils/conversationStore"

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
    // 게스트는 localStorage가 단일 출처, 유저는 백엔드 목록에 캐시된 제목을 보강한다.
    useEffect(() => {
        handleNewChat()
        if (!currentUser) {
            setConversations(loadGuestConversations())
            return
        }
        chatApi.getConversations(currentUser.user_id)
            .then(res => setConversations(withTitles(res.data)))
            .catch(err => console.error("대화 목록 조회 실패", err))
    }, [currentUser?.user_id, handleNewChat])

    // 사이드바에서 대화방 선택 시 히스토리 로드.
    // 게스트는 localStorage에서 정책 카드 메타까지 그대로 복원한다.
    const handleSelectChat = useCallback(async (selectedConversationId) => {
        setConversationId(selectedConversationId)
        if (!currentUser) {
            setMessages(loadGuestMessages(selectedConversationId))
            return
        }
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

        const optimistic = [...messages, { role: "user", content: text }]
        setMessages(optimistic)
        setLoading(true)

        try {
            const res = await chatApi.sendChat(text, conversationId, role, userId)
            const newConvId = res.data.conversation_id
            const next = [...optimistic, {
                role:         "bot",
                content:      res.data.message,
                category:     res.data.category     ?? [],
                inquiry_type: res.data.inquiry_type ?? "",
                policies:     res.data.policies     ?? [],
            }]
            setConversationId(newConvId)
            setMessages(next)

            // 게스트: localStorage 영속화(제목 파생 포함) / 유저: 제목 캐시만 보강.
            const title = currentUser
                ? deriveTitle(text)
                : saveGuestConversation(newConvId, next)
            if (currentUser) rememberTitle(newConvId, title)
            setConversations(prev => upsertConversation(prev, newConvId, title))
        } catch (err) {
            console.error(err)
            setMessages([...optimistic, {
                role: "bot",
                content: "서버 연결에 실패했습니다. 백엔드를 확인해주세요.",
            }])
        } finally {
            setLoading(false)
        }
    }, [currentUser, conversationId, loading, messages])

    const handleDeleteChat = useCallback(async (targetConversationId) => {
        if (!currentUser) {
            deleteGuestConversation(targetConversationId)
            setConversations(loadGuestConversations())
            if (conversationId === targetConversationId) handleNewChat()
            return
        }
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
