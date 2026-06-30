import { getDdayInfo } from "@/utils/policy";

function PolicyCard({ policy, onDetail, index = 0 }) {
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
        cnsgNmCn,
    } = policy;

    const dday = getDdayInfo(policy);
    const url = aplyUrlAddr?.trim();

    // 설명은 plcyExplnCn 우선, 없으면 plcySprtCn
    const description = plcyExplnCn || plcySprtCn;

    // 신청 대상: 연령 + 참여 대상 조합
    const targetParts = [];
    if (sprtTrgtAgeLmtYn === "Y" && sprtTrgtMinAge && sprtTrgtMaxAge) {
        targetParts.push(`만 ${sprtTrgtMinAge}~${sprtTrgtMaxAge}세`);
    }
    if (ptcpPrpTrgtCn) targetParts.push(ptcpPrpTrgtCn);
    const targetText = targetParts.join(" · ") || null;

    // 지원 내용: LLM 정리본(상세조회 시)이 있으면 우선 사용, 없으면 원문 폴백.
    // PolicyDetailModal의 "지원 내용"은 원문(plcySprtCn)을 그대로 유지한다.
    const supportContent = plcySprtCnSummary
        ? plcySprtCnSummary
        : (plcySprtCn && plcySprtCn !== description ? plcySprtCn : null);

    const fields = [
        ["지원 내용", supportContent],
        ["신청 대상", targetText],
        ["신청 방법", aplyMthdCn],
        ["문의처",   cnsgNmCn],
    ].filter(([, v]) => v);

    return (
        <div className="policy-card">
            <div className="policy-card-title-row">
                <span className="policy-card-name">{plcyNm}</span>
                {dday && (
                    <span className={`policy-card-dday${dday.muted ? " always-open" : ""}`}>
                        {dday.label}
                    </span>
                )}
            </div>

            {description && (
                <p className="policy-card-desc">{description}</p>
            )}

            {fields.length > 0 && (
                <div className="policy-card-fields">
                    {fields.map(([label, value]) => (
                        <div key={label} className="policy-card-field-row">
                            <span className="policy-card-field-label">{label}</span>
                            <span className="policy-card-field-value">{value}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="policy-card-footer">
                <span />
                {onDetail ? (
                    <button type="button" className="policy-card-link" onClick={() => onDetail(policy)}>
                        자세히 보기 →
                    </button>
                ) : url ? (
                    <a href={url} target="_blank" rel="noreferrer" className="policy-card-link">
                        자세히 보기 →
                    </a>
                ) : (
                    <span className="policy-card-link" style={{ color: "var(--border)" }}>
                        자세히 보기 →
                    </span>
                )}
            </div>
        </div>
    );
}

export default PolicyCard;
