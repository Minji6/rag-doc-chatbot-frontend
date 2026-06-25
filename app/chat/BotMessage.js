import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnalysisBadge from "@/app/chat/AnalysisBadge";

function BotMessage({ content, category = [], inquiryType = "" }) {
    return (
        <div className="message-row bot">
            <div className="avatar bot">🤖</div>
            <div className="message-bubble bot">
                <AnalysisBadge category={category} inquiryType={inquiryType} />
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    );
}

export default BotMessage;
