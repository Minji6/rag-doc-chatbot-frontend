"use client"

import MessageList from "@/app/chat/MessageList";
import ChatInput from "@/app/chat/ChatInput";
import UserDropdown from "@/app/UserDropdown";

function ChatWindow({ messages = [], loading, input, onSend, onInputChange, onKeyDown, onSelectQuestion, title = "새 대화" }) {
    return (
        <div className="chat-wrapper">
            <div className="chat-header">
                <div className="chat-header-left">
                    <h5>{title}</h5>
                    <small>맞춤형 청년 정책 추천</small>
                </div>
                <div className="chat-header-right">
                    <UserDropdown />
                </div>
            </div>

            <MessageList messages={messages} loading={loading} onSelectQuestion={onSelectQuestion} />

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
