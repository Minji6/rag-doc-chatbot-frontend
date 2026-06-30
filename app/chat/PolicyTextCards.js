"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDdayInfo, getUrgencyLevel } from "@/utils/policy";
import { parseMarkdownPolicies } from "@/utils/parseMarkdownPolicies";

// D-Day 배지 색상 — 화면에 표시되는 라벨을 기준으로 결정해 라벨↔색을 항상 일치시킨다.
//   상시 → 파랑(달력과 동일) / 마감 → 회색 / 마감임박(D-7 이하) → 빨강 / 그 외 진행중 → 주황
// (urgencyLevel의 "always"는 상시·마감·기한미상을 한데 묶어 색 결정에 부적합하므로 라벨을 우선한다.)
function ddayBadgeStyle(label, urgencyLevel) {
    if (label === "상시") {
        return { background: "#EAF2FB", color: "#4A90D9" };  // 상시모집 파랑
    }
    if (label === "마감" || urgencyLevel === "expired") {
        return { background: "#F3F4F6", color: "#9CA3AF" };  // 마감 회색
    }
    if (urgencyLevel === "urgent") {
        return { background: "#E5484D", color: "#fff" };   // 마감임박 빨강
    }
    return { background: "#F59E3C", color: "#fff" };       // 진행중 주황
}

// URL을 클릭 가능한 링크로 변환
function renderValue(value) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    if (!urlRegex.test(value)) return value;
    urlRegex.lastIndex = 0;

    const parts = [];
    let last = 0;
    let match;
    while ((match = urlRegex.exec(value)) !== null) {
        if (match.index > last) parts.push(value.slice(last, match.index));
        parts.push(
            <a
                key={match.index}
                href={match[0]}
                target="_blank"
                rel="noreferrer"
                className="policy-card-url-link"
            >
                {match[0]}
            </a>
        );
        last = match.index + match[0].length;
    }
    if (last < value.length) parts.push(value.slice(last));
    return parts;
}

/**
 * 백엔드 마크다운 텍스트를 파싱해 정책 카드 UI로 렌더링한다.
 *
 * @param {string}   content   - 백엔드 message 텍스트 (### 정책 블록 포함)
 * @param {object[]} policies  - D-Day 계산용 raw 정책 메타 (인덱스 순서 매칭)
 */
function PolicyTextCards({ content, policies = [], category = [] }) {
    const { intro, policies: parsed } = parseMarkdownPolicies(content);

    if (!parsed.length) {
        // 파싱 결과가 없으면 원본 마크다운 그대로 표시
        return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
    }

    return (
        <>
            {/* 도입부 텍스트 */}
            {intro && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
            )}

            {/* 정책 카드 목록 */}
            <div className="policy-card-list">
                {parsed.map(({ name, summary, fields }, i) => {
                    // D-Day: 인덱스 순서로 policies 메타와 매칭
                    const meta = policies[i];
                    const dday = meta ? getDdayInfo(meta) : null;
                    const urgencyLevel = meta ? getUrgencyLevel(meta) : "always";
                    const ddayStyle = ddayBadgeStyle(dday?.label, urgencyLevel);

                    return (
                        <div key={i} className="policy-card">
                            {/* 정책명 · D-Day */}
                            <div className="policy-card-title-row">
                                <span className="policy-card-name">{name}</span>
                                {dday && (
                                    <span className="policy-card-dday" style={ddayStyle}>
                                        {dday.label}
                                    </span>
                                )}
                            </div>

                            {/* 요약 설명 */}
                            {summary && (
                                <p className="policy-card-summary">{summary}</p>
                            )}

                            {/* 필드 행 */}
                            {fields.length > 0 && (
                                <div className="policy-card-fields">
                                    {fields.map(({ label, value }) => (
                                        <div key={label} className="policy-card-field-row">
                                            <span className="policy-card-field-label">
                                                {label}
                                            </span>
                                            <span className="policy-card-field-value">
                                                {renderValue(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default PolicyTextCards;
