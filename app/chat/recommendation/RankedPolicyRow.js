import MatchScoreRing from "@/app/chat/recommendation/MatchScoreRing";
import { formatDdayForMeta, getShortBenefit } from "@/utils/recommendation";

/**
 * 추천 2순위 이하 목록 행 — 순위 · 매칭 게이지 · 정책명 · 메타 한 줄.
 * onSelect가 있으면(로그인) 상세 모달, 없으면 신청 URL로 이동. 둘 다 없으면 정적 행.
 */
function RankedPolicyRow({ rank, policy, score, onSelect }) {
    const { plcyNm, category, aplyUrlAddr } = policy;

    const meta = [category, formatDdayForMeta(policy), getShortBenefit(policy)]
        .filter(Boolean)
        .join(" · ");

    const url = aplyUrlAddr?.trim();

    const inner = (
        <>
            <span className="reco-row-rank">{rank}</span>
            <MatchScoreRing score={score} size={46} />
            <span className="reco-row-info">
                <span className="reco-row-title">{plcyNm}</span>
                {meta && <span className="reco-row-meta">{meta}</span>}
            </span>
            <svg
                className="reco-row-chevron" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
                <path d="M9 18l6-6-6-6" />
            </svg>
        </>
    );

    if (onSelect) {
        return (
            <button type="button" className="reco-row" onClick={() => onSelect(policy)}>
                {inner}
            </button>
        );
    }
    if (url) {
        return (
            <a className="reco-row" href={url} target="_blank" rel="noreferrer">
                {inner}
            </a>
        );
    }
    return <div className="reco-row static">{inner}</div>;
}

export default RankedPolicyRow;
