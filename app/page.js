"use client"

import { useState } from "react"
import { ChatContextProvider, useChat } from "@/contexts/ChatContext"
import Sidebar from "@/app/Sidebar"
import ChatWindow from "@/app/chat/ChatWindow"
import ErrorMessage from "@/app/chat/ErrorMessage"

function ChatPage() {
    const { conversations, activeId, messages, loading, sendMessage, startNewChat, selectConversation } = useChat()
    const [input, setInput] = useState("")

    const handleSend = async () => {
        const text = input.trim()
        if (!text) return
        setInput("")
        await sendMessage(text)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSelectQuestion = (question) => {
        setInput(question)
    }

    const activeTitle = conversations.find(c => c.id === activeId)?.title ?? "새 대화"

    return (
        <div className="app-layout">
            <Sidebar
                conversations={conversations}
                activeId={activeId}
                onSelectChat={selectConversation}
                onNewChat={startNewChat}
            />
            <div className="main-content">
                <ErrorMessage />
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    input={input}
                    onSend={handleSend}
                    onInputChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onSelectQuestion={handleSelectQuestion}
                    title={activeTitle}
                />
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <ChatContextProvider>
            <ChatPage />
        </ChatContextProvider>
    )
}
