"use client"

import { useState } from "react";
import { ChatContextProvider, useChat } from "@/contexts/ChatContext";
import { SavedPoliciesProvider } from "@/contexts/SavedPoliciesContext";
import Sidebar from "@/app/chat/Sidebar";
import ChatWindow from "@/app/chat/ChatWindow";
import ErrorMessage from "@/app/chat/ErrorMessage";

function ChatPage() {
    const {
        conversations,
        conversationId,
        messages,
        loading,
        handleNewChat,
        handleSelectChat,
        handleSend,
        handleDeleteChat,
    } = useChat()

    const [input, setInput] = useState("")

    const activeTitle = messages.length > 0
        ? messages.find(m => m.role === "user")?.content?.slice(0, 20) ?? "새 대화"
        : "새 대화"

    const onNewChat = () => {
        handleNewChat()
        setInput("")
    }

    const onSelectChat = (id) => {
        handleSelectChat(id)
        setInput("")
    }

    const onSend = async () => {
        const text = input.trim()
        if (!text || loading) return
        setInput("")
        await handleSend(text)
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSend()
        }
    }

    return (
        <div className="app-layout">
            <Sidebar
                conversations={conversations}
                activeId={conversationId}
                onSelectChat={onSelectChat}
                onNewChat={onNewChat}
                onDeleteChat={handleDeleteChat}
            />
            <div className="main-content">
                <ErrorMessage />
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    input={input}
                    onSend={onSend}
                    onInputChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onSelectQuestion={q => setInput(q)}
                    title={activeTitle}
                />
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <ChatContextProvider>
            <SavedPoliciesProvider>
                <ChatPage />
            </SavedPoliciesProvider>
        </ChatContextProvider>
    )
}
