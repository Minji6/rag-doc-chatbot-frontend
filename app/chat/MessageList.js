"use client"

import { useRef, useEffect } from "react";
import UserMessage from "@/app/chat/UserMessage";
import BotMessage from "@/app/chat/BotMessage";
import TypingIndicator from "@/app/chat/TypingIndicator";
import EmptyState from "@/app/chat/EmptyState";

function MessageList({ messages = [], loading, onSelectQuestion }) {
    // DOM 참조 - 자동 스크롤용
    const messagesEndRef = useRef(null);

    // 새 메시지 올 때 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) {
        return <EmptyState onSelectQuestion={onSelectQuestion} />;
    }

    return (
        <div className="chat-messages">
            {messages.map((msg, i) => (
                msg.role === "user"
                    ? <UserMessage key={i} content={msg.content} />
                    : <BotMessage key={i} content={msg.content} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
