"use client"

import { useRef, useEffect } from "react";
import UserMessage from "@/app/chat/UserMessage";
import BotMessage from "@/app/chat/BotMessage";
import TypingIndicator from "@/app/chat/TypingIndicator";
import EmptyState from "@/app/chat/EmptyState";

function MessageList({ messages = [], loading, onSelectQuestion }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) {
        return <EmptyState onSelectQuestion={onSelectQuestion} />;
    }

    return (
        <div className="chat-messages">
            {messages.map((msg, i) =>
                msg.role === "user"
                    ? <UserMessage key={i} content={msg.content} image={msg.image} />
                    : <BotMessage
                        key={i}
                        content={msg.content}
                        category={msg.category}
                        inquiry_type={msg.inquiry_type}
                        policies={msg.policies}
                        suggestions={msg.suggestions}
                        onSelectQuestion={onSelectQuestion}
                    />
            )}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
