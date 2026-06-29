function UserMessage({ content, image }) {
    return (
        <div className="message-row user">
            <div className="avatar user">나</div>
            <div className="message-bubble user">
                {image && (
                    // 첨부 이미지 미리보기 (브라우저 메모리 URL이라 next/image 대신 img 사용)
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="첨부 이미지" className="message-image" />
                )}
                {content}
            </div>
        </div>
    );
}

export default UserMessage;
