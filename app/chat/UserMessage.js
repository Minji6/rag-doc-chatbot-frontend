function UserMessage({ content }) {
    return (
        <div className="message-row user">
            <div className="avatar user">나</div>
            <div className="message-bubble user">
                {content}
            </div>
        </div>
    );
}

export default UserMessage;
