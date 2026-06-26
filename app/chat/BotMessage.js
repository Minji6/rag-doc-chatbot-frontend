import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PolicyCard from "@/app/chat/PolicyCard";

const CATEGORY_STYLE = {
    복지:   { color: "var(--color-welfare)",   bg: "var(--color-welfare-bg)" },
    주거:   { color: "var(--color-housing)",   bg: "var(--color-housing-bg)" },
    교육:   { color: "var(--color-education)", bg: "var(--color-education-bg)" },
    일자리: { color: "var(--color-job)",       bg: "var(--color-job-bg)" },
};

function BotMessage({ content, category = [], inquiry_type = "", policies = [] }) {
    const hasAnalysis = category.length > 0 || inquiry_type;

    return (
        <div className="message-row bot">
            <div className="avatar bot">
                <img
                    src="/cheongpodo-bot.png"
                    alt="청포도"
                    onError={e => {
                        e.target.parentElement.textContent = "🤖";
                    }}
                />
            </div>
            <div className="message-bubble bot">
                {hasAnalysis && (
                    <div className="analysis-badge-row">
                        <span className="analysis-badge complete">+ 분석 완료</span>
                        {category.map(cat => {
                            const style = CATEGORY_STYLE[cat];
                            return (
                                <span
                                    key={cat}
                                    className="analysis-badge category"
                                    style={style ? { color: style.color, background: style.bg, borderColor: "transparent" } : {}}
                                >
                                    분야 {cat}
                                </span>
                            );
                        })}
                        {inquiry_type && (
                            <span className="analysis-badge intent">의도 {inquiry_type}</span>
                        )}
                    </div>
                )}

                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

                {policies.length > 0 && (
                    <div className="policy-card-list">
                        {policies.map((policy, i) => (
                            <PolicyCard key={i} policy={policy} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BotMessage;
