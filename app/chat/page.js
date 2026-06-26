"use client"

import { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import Sidebar from "@/app/chat/Sidebar";
import ChatWindow from "@/app/chat/ChatWindow";

function Home() {
    const {
        conversations,
        messages,
        loading,
        handleNewChat,
        handleSelectChat,
        handleSend,
        handleDeleteChat,
    } = useChat()

    const [input, setInput]       = useState("")
    const [activeId, setActiveId] = useState(null)

    const activeTitle = activeId
        ? activeId.slice(0, 20)
        : (messages.length > 0
            ? messages.find(m => m.role === "user")?.content?.slice(0, 20) ?? "새 대화"
            : "새 대화")

    const onNewChat = () => {
        handleNewChat()
        setActiveId(null)
        setInput("")
    }

    const onSelectChat = (id) => {
        setActiveId(id)
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
                activeId={activeId}
                onSelectChat={onSelectChat}
                onNewChat={onNewChat}
                onDeleteChat={handleDeleteChat}
            />
            <div className="main-content">
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

export default Home;
