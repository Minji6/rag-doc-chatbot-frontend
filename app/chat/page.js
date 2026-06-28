"use client"

import { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import Sidebar from "@/app/chat/Sidebar";
import ChatWindow from "@/app/chat/ChatWindow";

function Home() {
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
    const [attach, setAttach] = useState(null)

    const activeTitle = messages.length > 0
        ? messages.find(m => m.role === "user")?.content?.slice(0, 20) ?? "새 대화"
        : "새 대화"

    const onNewChat = () => {
        handleNewChat()
        setInput("")
        setAttach(null)
    }

    const onSelectChat = (id) => {
        handleSelectChat(id)
        setInput("")
        setAttach(null)
    }

    const onSend = async () => {
        const text = input.trim()
        if ((!text && !attach) || loading) return
        const sent = attach
        setInput("")
        setAttach(null)
        await handleSend(text, sent)
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
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    input={input}
                    attach={attach}
                    onSend={onSend}
                    onInputChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onAttach={setAttach}
                    onRemoveAttach={() => setAttach(null)}
                    onSelectQuestion={q => setInput(q)}
                    title={activeTitle}
                />
            </div>
        </div>
    );
}

export default Home;
