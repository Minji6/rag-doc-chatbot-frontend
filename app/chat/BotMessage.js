function BotMessage({ content }) {
    return (
        <div className="message-row bot">
            <div className="avatar bot">🤖</div>
            <div className="message-bubble bot">
                {/* AnalysisBadge 연동 예정 (팀원 담당) */}
                {content}
            </div>
        </div>
    );
}

export default BotMessage;
