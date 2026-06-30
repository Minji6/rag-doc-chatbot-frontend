"use client"

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_STYLE } from "@/utils/policy";
import PolicyResultList from "@/app/chat/PolicyResultList";
import PolicyDetailModal from "@/app/chat/PolicyDetailModal";

// LLM이 본문 뒤에 suggestions를 덧붙였을 때 제거.
// separator(---SUGGESTIONS---) 기준으로만 잘라낸다. 과거엔 JSON 배열 패턴까지
// 휴리스틱으로 제거했으나, 본문에 포함된 코드 예시·일반 텍스트의 대괄호 배열을
// 오인해 정상 답변을 무음 삭제하는 위험이 있어 separator 기반으로 한정한다.
function stripEmbeddedSuggestions(text) {
    return (text ?? "").replace(/---SUGGESTIONS---[\s\S]*$/m, "").trimEnd();
}

function BotMessage({ content, category = [], inquiry_type = [], policies = [], suggestions = [], onSelectQuestion }) {
    const { currentUser } = useAuth();
    // 상세 모달은 BotMessage가 소유한다 — 각 답변 메시지가 독립적으로 모달 상태를 가진다.
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const types = Array.isArray(inquiry_type) ? inquiry_type : (inquiry_type ? [inquiry_type] : []);
    const isDetail = types.includes("상세조회");

    const hasAnalysis = category.length > 0 || types.length > 0;
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
                        {types.length > 0 && (
                            <span className="analysis-badge intent">의도 {types.join(", ")}</span>
                        )}
                    </div>
                )}

                {/* 텍스트 메시지: 내용이 있으면 항상 표시. 상세조회는 카드 위 안내 멘트로 활용. */}
                {cleanContent && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                )}

                {/* 상세조회 의도일 때만 정책 카드를 렌더한다.
                    추천·검색·비교는 텍스트 답변만 표시. */}
                {isDetail && (
                    <PolicyResultList
                        policies={policies}
                        onSelectPolicy={currentUser ? setSelectedPolicy : undefined}
                    />
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
