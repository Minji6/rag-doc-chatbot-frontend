import { getDdayInfo, getUrgencyLevel } from "@/utils/policy";

// 번호 · 레이블에 쓰는 단일 accent 색상 — globals.css의 --primary(그린) 계열
const ACCENT_COLOR = "var(--primary)";

// D-Day 배지 색상 — 마감 상태별 구분 (PolicyTextCards와 동일 규칙).
//   마감임박(D-7 이하) → 빨강 / 진행중 → 주황 / 마감됨·상시 → 회색
function ddayBadgeStyle(urgencyLevel, muted) {
    if (muted || urgencyLevel === "expired" || urgencyLevel === "always") {
        return { background: "#F3F4F6", color: "#9CA3AF" };
    }
    if (urgencyLevel === "urgent") {
        return { background: "#E5484D", color: "#fff" };
    }
    return { background: "#F59E3C", color: "#fff" };
}

function PolicyCard({ policy, index = 0, onDetail }) {
    const {
        plcyNm,
        plcyExplnCn,
        plcySprtCn,
        ptcpPrpTrgtCn,
        aplyUrlAddr,
        sprtTrgtMinAge,
        sprtTrgtMaxAge,
        sprtTrgtAgeLmtYn,
        aplyMthdCn,
    } = policy;

    const dday = getDdayInfo(policy);
    const urgencyLevel = getUrgencyLevel(policy);
    const accentColor = ACCENT_COLOR;
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

    // 지원 내용: summary와 다를 때만 별도 표시
    const supportContent = plcySprtCn && plcySprtCn !== summary ? plcySprtCn : null;

    const fields = [
        ["지원 내용", supportContent],
        ["참여 자격", targetText],
        ["신청 방법", aplyMthdCn],
        url ? ["신청 URL", (
            <a href={url} target="_blank" rel="noreferrer" className="policy-card-url-link">
                {url}
            </a>
        )] : null,
    ].filter(Boolean).filter(([, v]) => v);

    // D-Day 배지 스타일 — 긴급도별 색상
    const ddayStyle = ddayBadgeStyle(urgencyLevel, dday?.muted);

    return (
        <div className="policy-card">
            {/* 번호 · 제목 · D-Day 행 */}
            <div className="policy-card-title-row">
                <span className="policy-card-number" style={{ color: accentColor }}>
                    {index + 1}.
                </span>
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
