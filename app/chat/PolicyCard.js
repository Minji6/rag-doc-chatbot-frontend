import { getDdayInfo, getUrgencyLevel } from "@/utils/policy";

// D-Day 배지 색상 — 화면에 표시되는 라벨을 기준으로 결정해 라벨↔색을 항상 일치시킨다.
//   상시 → 파랑(달력과 동일) / 마감 → 회색 / 마감임박(D-7 이하) → 빨강 / 그 외 진행중 → 주황
// (urgencyLevel의 "always"는 상시·마감·기한미상을 한데 묶어 색 결정에 부적합하므로 라벨을 우선한다.)
function ddayBadgeStyle(label, urgencyLevel) {
    if (label === "상시") {
        return { background: "#EAF2FB", color: "#4A90D9" };
    }
    if (label === "마감" || urgencyLevel === "expired") {
        return { background: "#F3F4F6", color: "#9CA3AF" };
    }
    if (urgencyLevel === "urgent") {
        return { background: "#E5484D", color: "#fff" };
    }
    return { background: "#F59E3C", color: "#fff" };
}

function PolicyCard({ policy, onDetail }) {
    const {
        plcyNm,
        plcyExplnCn,
        plcySprtCn,
        plcySprtCnSummary,
        ptcpPrpTrgtCn,
        aplyUrlAddr,
        sprtTrgtMinAge,
        sprtTrgtMaxAge,
        sprtTrgtAgeLmtYn,
        aplyMthdCn,
    } = policy;

    const dday = getDdayInfo(policy);
    const urgencyLevel = getUrgencyLevel(policy);
    const url = aplyUrlAddr?.trim();

    // 요약: plcyExplnCn 우선, 없으면 plcySprtCn
    const summary = plcyExplnCn || plcySprtCn;

    // 참여 자격: 연령 + 참여 대상
    const targetParts = [];
    if (sprtTrgtAgeLmtYn === "Y" && sprtTrgtMinAge && sprtTrgtMaxAge) {
        targetParts.push(`만 ${sprtTrgtMinAge}~${sprtTrgtMaxAge}세`);
    }
    if (ptcpPrpTrgtCn) targetParts.push(ptcpPrpTrgtCn);
    const targetText = targetParts.join(" · ") || null;

    // 지원 내용: LLM 정리본(상세조회 시 plcySprtCnSummary)이 있으면 우선 사용,
    // 없으면 원문(plcySprtCn)을 summary와 다를 때만 폴백 표시.
    // PolicyDetailModal의 "지원 내용"은 원문(plcySprtCn)을 그대로 유지한다.
    const supportContent = plcySprtCnSummary
        ? plcySprtCnSummary
        : (plcySprtCn && plcySprtCn !== summary ? plcySprtCn : null);

    const fields = [
        ["지원 내용", supportContent],
        ["참여 자격", targetText],
        ["신청 방법", aplyMthdCn],
        url ? ["신청 URL", (
            <a key="apply-url" href={url} target="_blank" rel="noreferrer" className="policy-card-url-link">
                {url}
            </a>
        )] : null,
    ].filter(Boolean).filter(([, v]) => v);

    // D-Day 배지 스타일 — 긴급도별 색상
    const ddayStyle = ddayBadgeStyle(dday?.label, urgencyLevel);

    return (
        <div className="policy-card">
            {/* 제목 · D-Day 행 */}
            <div className="policy-card-title-row">
                <span className="policy-card-name">{plcyNm}</span>
                {dday && (
                    <span className="policy-card-dday" style={ddayStyle}>
                        {dday.label}
                    </span>
                )}
            </div>

            {/* 요약 */}
            {summary && (
                <p className="policy-card-summary">{summary}</p>
            )}

            {/* 필드 행 */}
            {fields.length > 0 && (
                <div className="policy-card-fields">
                    {fields.map(([label, value]) => (
                        <div key={label} className="policy-card-field-row">
                            <span className="policy-card-field-label">
                                {label}
                            </span>
                            <span className="policy-card-field-value">{value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* 상세 진입점: onDetail 주입 시 모달, 아니면 신청 URL로 이동 */}
            {(onDetail || url) && (
                <div className="policy-card-footer">
                    {onDetail ? (
                        <button type="button" className="policy-card-link" onClick={() => onDetail(policy)}>
                            자세히 보기 →
                        </button>
                    ) : (
                        <a href={url} target="_blank" rel="noreferrer" className="policy-card-link">
                            자세히 보기 →
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default PolicyCard;
