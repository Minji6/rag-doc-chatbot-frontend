import MatchScoreRing from "@/app/chat/recommendation/MatchScoreRing";
import { categoryStyle, getDdayInfo, getUrgencyLevel, getDdayBadgeStyle } from "@/utils/policy";
import { extractBenefitHighlight } from "@/utils/recommendation";

/**
 * 추천 1순위 하이라이트 카드.
 * 큰 매칭 게이지 + 분야/D-Day 배지 + 정책명 + 요약 + 혜택 금액 한 줄.
 */
function TopPolicyCard({ policy, score, label, onSelect }) {
    const { plcyNm, category } = policy;
    const style = categoryStyle(category);
    const dday = getDdayInfo(policy);
    // 배지와 같은 단일 출처(URGENCY)에서 글자색만 가져온다.
    const ddayColor = dday ? getDdayBadgeStyle(dday.label, getUrgencyLevel(policy)).color : null;

    const summary = policy.plcyExplnCn || policy.plcySprtCnSummary || policy.plcySprtCn;
    const benefit = extractBenefitHighlight(policy);
    const clickable = typeof onSelect === "function";

    return (
        <div
            className={`reco-top-card${clickable ? " clickable" : ""}`}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onSelect(policy) : undefined}
            onKeyDown={clickable ? (e) => { if (e.key === "Enter") onSelect(policy); } : undefined}
        >
            <span className="reco-top-label">{label}</span>

            <div className="reco-top-body">
                <MatchScoreRing score={score} size={92} strokeWidth={8} showPercent />

                <div className="reco-top-info">
                    <div className="reco-top-badge-row">
                        {category && (
                            <span
                                className="policy-card-category"
                                style={{ color: style.color, background: style.bg }}
                            >
                                {category}
                            </span>
                        )}
                        {dday && (
                            <span className="reco-top-dday" style={{ color: ddayColor }}>
                                {dday.label}
                            </span>
                        )}
                    </div>

                    <h3 className="reco-top-title">{plcyNm}</h3>

                    {summary && <p className="reco-top-summary">{summary}</p>}

                    {benefit && (
                        <span className="reco-top-benefit">₩ {benefit}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopPolicyCard;
