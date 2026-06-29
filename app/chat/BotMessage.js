import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CATEGORY_STYLE = {
    복지문화: { color: "var(--color-welfare)",   bg: "var(--color-welfare-bg)" },
    주거:     { color: "var(--color-housing)",   bg: "var(--color-housing-bg)" },
    교육:     { color: "var(--color-education)", bg: "var(--color-education-bg)" },
    일자리:   { color: "var(--color-job)",       bg: "var(--color-job-bg)" },
};

// LLM이 separator 없이 suggestions JSON을 본문에 포함했을 때 제거
function stripEmbeddedSuggestions(text) {
    return text
        .replace(/---SUGGESTIONS---[\s\S]*$/m, "")  // separator 이후 전체
        .replace(/\[["'].*["']\s*,[\s\S]*?\]/m, "") // JSON 배열 패턴
        .trimEnd();
}

function BotMessage({ content, category = [], inquiry_type = "", policies = [], suggestions = [], onSelectQuestion }) {
    const hasAnalysis = category.length > 0 || inquiry_type;
    const cleanContent = stripEmbeddedSuggestions(content);

    return (
        <div className="message-row bot">
            <div className="avatar bot">
                <Image
                    src="/cheongpodo-bot.png"
                    alt="청포도"
                    width={38}
                    height={38}
                    className="avatar bot"
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

                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>

                {suggestions.length > 0 && (
                    <div className="suggestions-row">
                        {suggestions.map((q, i) => (
                            <button
                                key={i}
                                className="suggestion-chip"
                                onClick={() => onSelectQuestion?.(q)}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BotMessage;
