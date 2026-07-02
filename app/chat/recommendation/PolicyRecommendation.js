"use client"

import { useState } from "react";
import TopPolicyCard from "@/app/chat/recommendation/TopPolicyCard";
import RankedPolicyRow from "@/app/chat/recommendation/RankedPolicyRow";
import { getMatchScore, sortByDeadline } from "@/utils/recommendation";

const SORT_MODES = [
    { key: "match",    label: "매칭순" },
    { key: "deadline", label: "마감임박순" },
];

/**
 * 정책추천 의도 전용 결과 뷰.
 * 헤더(건수 + 정렬 토글) → 1순위 하이라이트 카드 → 2순위 이하 목록.
 *
 * 점수는 백엔드가 실어 보내는 suitability_score(적합도)를 그대로 쓴다.
 * 멀티 분야 응답은 분야별로 이어붙여 오므로, 매칭순 정렬은 점수 기준으로 다시 정렬한다.
 */
function PolicyRecommendation({ policies = [], onSelectPolicy }) {
    const [sortMode, setSortMode] = useState("match");

    if (!policies.length) return null;

    const ranked = policies.map((policy, i) => ({ policy, score: getMatchScore(policy, i) }));
    const sorted = sortMode === "deadline"
        ? sortByDeadline(ranked)
        : [...ranked].sort((a, b) => b.score - a.score);
    const [top, ...rest] = sorted;

    const topLabel = sortMode === "match"
        ? "🏆 가장 잘 맞는 정책"
        : "⏰ 마감이 가장 임박한 정책";

    return (
        <div className="reco-block">
            <div className="reco-header">
                <span className="reco-count">
                    조건에 맞는 정책 <strong>{policies.length}개</strong>를 찾았어요
                </span>
                <div className="reco-sort" role="group" aria-label="정렬 방식">
                    {SORT_MODES.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={`reco-sort-btn${sortMode === key ? " active" : ""}`}
                            onClick={() => setSortMode(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <TopPolicyCard
                policy={top.policy}
                score={top.score}
                label={topLabel}
                onSelect={onSelectPolicy}
            />

            {rest.length > 0 && (
                <div className="reco-list">
                    {rest.map((item, i) => (
                        <RankedPolicyRow
                            key={item.policy.plcyNo ?? `${item.policy.plcyNm}-${i}`}
                            rank={i + 2}
                            policy={item.policy}
                            score={item.score}
                            onSelect={onSelectPolicy}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PolicyRecommendation;
