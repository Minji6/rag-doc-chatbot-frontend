"use client"

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_STYLE } from "@/utils/policy";
import PolicyResultList from "@/app/chat/PolicyResultList";
import PolicyTextCards from "@/app/chat/PolicyTextCards";
import PolicyDetailModal from "@/app/chat/PolicyDetailModal";

// LLM이 본문 뒤에 suggestions를 덧붙였을 때 제거.
function stripEmbeddedSuggestions(text) {
    return (text ?? "").replace(/---SUGGESTIONS---[\s\S]*$/m, "").trimEnd();
}

function BotMessage({ content, category = [], inquiry_type = "", policies = [], suggestions = [], onSelectQuestion }) {
    const { currentUser } = useAuth();
    // 상세 모달은 각 답변 메시지가 독립적으로 소유한다.
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const types = Array.isArray(inquiry_type) ? inquiry_type : inquiry_type ? [inquiry_type] : [];
    const typeLabel = types.join(" · ");
    const hasAnalysis = category.length > 0 || types.length > 0;
    const cleanContent = stripEmbeddedSuggestions(content);

    // ── 렌더 분기 ──────────────────────────────────────────────────
    // 상세조회: 텍스트 없음, 구조화 데이터로 PolicyResultList
    const isDetailOnly = types.length === 1 && types[0] === "상세조회";
    // 비교: 비교표가 핵심 → ReactMarkdown 그대로
    const isCompareOnly = types.length === 1 && types[0] === "비교";

    // 텍스트에 ### 정책 블록이 있고 비교/상세조회가 아닐 때 → PolicyTextCards.
    // 주의: "### " 헤더에만 의존하므로 LLM이 포맷을 바꾸면 false가 되어
    //       카드 대신 아래 showPlainText(ReactMarkdown)로 자연스럽게 fallback된다.
    const hasPolicyBlocks = /^### /m.test(cleanContent);
    const showTextCards = !isDetailOnly && !isCompareOnly && hasPolicyBlocks;

    // 그 외 일반 텍스트 (추천·비교·일반대화)
    const showPlainText = !isDetailOnly && !showTextCards;

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
                        {typeLabel && (
                            <span className="analysis-badge intent">의도 {typeLabel}</span>
                        )}
                    </div>
                )}

                {/* 상세조회: 구조화 데이터 카드 */}
                {isDetailOnly && (
                    <PolicyResultList
                        policies={policies}
                        onSelectPolicy={currentUser ? setSelectedPolicy : undefined}
                    />
                )}

                {/* 검색·복합: 백엔드 텍스트 파싱 → 카드 */}
                {showTextCards && (
                    <PolicyTextCards content={cleanContent} policies={policies} category={category} />
                )}

                {/* 추천·비교·일반대화: 마크다운 그대로 */}
                {showPlainText && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                )}

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
