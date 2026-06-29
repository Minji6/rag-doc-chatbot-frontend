function NewChatButton({ onClick }) {
    return (
        <button className="btn new-chat-btn w-100" onClick={onClick}>
            + 새 대화 시작
        </button>
    )
}

export default NewChatButton
