"use client"

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_STYLE } from "@/utils/policy";
import { parseMarkdownPolicies } from "@/utils/parseMarkdownPolicies";
import PolicyResultList from "@/app/chat/PolicyResultList";
import PolicyTextCards from "@/app/chat/PolicyTextCards";
import PolicyDetailModal from "@/app/chat/PolicyDetailModal";
import PolicyRecommendation from "@/app/chat/recommendation/PolicyRecommendation";

// LLM이 본문 뒤에 suggestions를 덧붙였을 때 제거.
function stripEmbeddedSuggestions(text) {
    return (text ?? "").replace(/---SUGGESTIONS---[\s\S]*$/m, "").trimEnd();
}

/** 분석 완료 · 분야 · 의도 배지 행 */
function AnalysisBadges({ category, types }) {
    return (
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
            {types.length > 0 && (
                <span className="analysis-badge intent">의도 {types.join(", ")}</span>
            )}
        </div>
    );
}

/** 후속 질문 제안 칩 */
function SuggestionChips({ suggestions, onSelectQuestion }) {
    if (!suggestions.length) return null;
    return (
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
    );
}

function BotMessage({ content, category = [], inquiry_type = [], policies = [], suggestions = [], onSelectQuestion }) {
    const { currentUser } = useAuth();
    // 상세 모달은 각 답변 메시지가 독립적으로 소유한다.
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    // 백엔드가 inquiry_type을 배열로 반환하므로 배열/문자열 모두 처리
    const types = Array.isArray(inquiry_type) ? inquiry_type : (inquiry_type ? [inquiry_type] : []);
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

    // 추천: 구조화된 policies가 있을 때만 랭킹 뷰. 없으면 기존 분기로 fallback.
    // 백엔드 inquiry_type 실제 값은 "추천"(INQUIRY_TYPES 상수 기준) — "정책추천"이 아님에 주의.
    const isRecommendation = types.includes("추천") && policies.length > 0;

    // ── 추천 전용 레이아웃: 말풍선(도입부) + 랭킹 결과 블록 ────────────
    if (isRecommendation) {
        // 말풍선에는 도입 멘트만 남긴다. ### 정책 블록 상세는 랭킹 카드가 대신한다.
        const intro = hasPolicyBlocks
            ? parseMarkdownPolicies(cleanContent).intro
            : cleanContent;

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
                <div className="message-col">
                    {(hasAnalysis || intro || suggestions.length > 0) && (
                        <div className="message-bubble bot">
                            {hasAnalysis && <AnalysisBadges category={category} types={types} />}
                            {intro && (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
                            )}
                            <SuggestionChips suggestions={suggestions} onSelectQuestion={onSelectQuestion} />
                        </div>
                    )}
                    <PolicyRecommendation
                        policies={policies}
                        onSelectPolicy={currentUser ? setSelectedPolicy : undefined}
                    />
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

    const showTextCards = !isDetailOnly && !isCompareOnly && hasPolicyBlocks;

    // 그 외 일반 텍스트 (비교·일반대화)
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
                {hasAnalysis && <AnalysisBadges category={category} types={types} />}

                {/* 상세조회: 카드 위 안내 멘트(composer 메시지, 있으면) + 구조화 데이터 카드 */}
                {isDetailOnly && (
                    <>
                        {cleanContent && (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                        )}
                        <PolicyResultList
                            policies={policies}
                            onSelectPolicy={currentUser ? setSelectedPolicy : undefined}
                        />
                    </>
                )}

                {/* 검색·복합: 백엔드 텍스트 파싱 → 카드 */}
                {showTextCards && (
                    <PolicyTextCards content={cleanContent} policies={policies} category={category} />
                )}

                {/* 비교·일반대화: 마크다운 그대로 */}
                {showPlainText && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                )}

                <SuggestionChips suggestions={suggestions} onSelectQuestion={onSelectQuestion} />
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
