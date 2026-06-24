"use client"

import MessageList from "@/app/chat/MessageList";
import ChatInput from "@/app/chat/ChatInput";

function ChatWindow({ messages = [], loading, input, onSend, onInputChange, onKeyDown }) {
    return (
        <div className="chat-wrapper">
            <div className="chat-header">
                <h5>청년정책 지원 챗봇</h5>
                <small>주거 · 취업 · 교육 · 복지 분야 맞춤 정책 안내</small>
            </div>

            <MessageList messages={messages} loading={loading} />

            <ChatInput
                input={input}
                loading={loading}
                onSend={onSend}
                onInputChange={onInputChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
}

export default ChatWindow;
