function TypingIndicator() {
    return (
        <div className="message-row bot">
            <div className="avatar bot">🤖</div>
            <div className="message-bubble bot">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </div>
    );
}

export default TypingIndicator;
