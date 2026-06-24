<<<<<<< HEAD
// 질문 입력창
=======
function ChatInput({ input, loading, onSend, onInputChange, onKeyDown }) {
    return (
        <div className="chat-input-area">
            <div className="chat-input-box">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="청년 정책에 대해 무엇이든 물어보세요"
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                />
                <button
                    className="send-btn"
                    onClick={onSend}
                    disabled={loading || !input.trim()}
                >
                    ↑
                </button>
            </div>
            <p className="chat-input-disclaimer">
                AI가 제공하는 정보는 참고용이며, 정확한 내용은 각 기관에서 확인하세요.
            </p>
        </div>
    );
}

export default ChatInput;
>>>>>>> add014d870ae8ea79fa8945bc538ca6618503a5c
