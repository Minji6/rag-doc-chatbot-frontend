"use client"

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_STYLE } from "@/utils/policy";
import PolicyResultList from "@/app/chat/PolicyResultList";
import PolicyDetailModal from "@/app/chat/PolicyDetailModal";

// LLM이 separator 없이 suggestions JSON을 본문에 포함했을 때 제거
function stripEmbeddedSuggestions(text) {
    return text
        .replace(/---SUGGESTIONS---[\s\S]*$/m, "")  // separator 이후 전체
        .replace(/\[["'].*["']\s*,[\s\S]*?\]/m, "") // JSON 배열 패턴
        .trimEnd();
}

function BotMessage({ content, category = [], inquiry_type = "", policies = [], suggestions = [], onSelectQuestion }) {
    const { currentUser } = useAuth();
    // 상세 모달은 BotMessage가 소유한다 — 각 답변 메시지가 독립적으로 모달 상태를 가진다.
    const [selectedPolicy, setSelectedPolicy] = useState(null);

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

                {/* 정책 카드 목록 — 로그인 유저에게만 상세 모달 진입점(onSelectPolicy)을 준다.
                    게스트는 콜백을 받지 못해 카드가 외부 신청 URL로 직접 연결된다. */}
                <PolicyResultList
                    policies={policies}
                    onSelectPolicy={currentUser ? setSelectedPolicy : undefined}
                />

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

            {selectedPolicy && (
                <PolicyDetailModal
                    policy={selectedPolicy}
                    onClose={() => setSelectedPolicy(null)}
                />
            )}
        </div>
    );
}

export default BotMessage;
