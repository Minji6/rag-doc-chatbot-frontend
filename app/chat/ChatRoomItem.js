function ChatRoomItem({ conversation, isActive, onClick }) {
    return (
        <div
            className={`sidebar-chat-item ${isActive ? "active" : ""}`}
            onClick={() => onClick(conversation.id)}
        >
            {conversation.title}
        </div>
    )
}

export default ChatRoomItem
