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
        // 입력값은 즉시 비우되 첨부 파일은 전송 성공 후에만 비운다.
        // 텍스트 재입력은 쉽지만, 첨부는 파일 탐색기를 다시 열어야 하므로
        // 전송 실패 시 선택했던 이미지를 잃지 않도록 보존한다.
        setInput("")
        const ok = await handleSend(text, sent)
        if (ok) {
            setAttach(null)
        } else {
            setInput(text) // 실패 시 텍스트·첨부 모두 복원
        }
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

export default function Home() {
    return (
        <ChatContextProvider>
            <SavedPoliciesProvider>
                <ChatPage />
            </SavedPoliciesProvider>
        </ChatContextProvider>
    )
}
