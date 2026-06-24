"use client"

import { useRef, useEffect } from "react";
import UserMessage from "@/app/chat/UserMessage";
import BotMessage from "@/app/chat/BotMessage";

function MessageList({ messages = [], loading }) {
    // DOM 참조 - 자동 스크롤용
    const messagesEndRef = useRef(null);

    // 새 메시지 올 때 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="chat-messages">
            {messages.map((msg, i) => (
                msg.role === "user"
                    ? <UserMessage key={i} content={msg.content} />
                    : <BotMessage key={i} content={msg.content} />
            ))}
            {/* TypingIndicator 로 분리 예정 (팀원 담당) */}
            {loading && (
                <div className="message-row bot">
                    <div className="avatar bot">🤖</div>
                    <div className="message-bubble bot">답변을 생성하는 중...</div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
