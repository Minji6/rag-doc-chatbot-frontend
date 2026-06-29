"use client"

import { useChat } from "@/contexts/ChatContext"

function ErrorMessage() {
    const { error, clearError } = useChat()

    if (!error) return null

    return (
        <div className="error-message-bar">
            <span className="error-message-text">⚠ {error}</span>
            <button className="error-message-close" onClick={clearError}>✕</button>
        </div>
    )
}

export default ErrorMessage
