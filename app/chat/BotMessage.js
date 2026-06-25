import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function BotMessage({ content }) {
    return (
        <div className="message-row bot">
            <div className="avatar bot">🤖</div>
            <div className="message-bubble bot">
                {/* AnalysisBadge 연동 예정 (팀원 담당) */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    );
}

export default BotMessage;
