const CATEGORY_STYLE = {
    복지문화: { color: "var(--color-welfare)",   bg: "var(--color-welfare-bg)" },
    주거:     { color: "var(--color-housing)",   bg: "var(--color-housing-bg)" },
    교육:     { color: "var(--color-education)", bg: "var(--color-education-bg)" },
    일자리:   { color: "var(--color-job)",       bg: "var(--color-job-bg)" },
};

// "YYYYMMDD  " → D-N 계산
function calcDday(endYmd) {
    if (!endYmd || !endYmd.trim()) return null;
    const clean = endYmd.trim();
    if (clean.length < 8) return null;
    const y = clean.slice(0, 4), m = clean.slice(4, 6), d = clean.slice(6, 8);
    const end = new Date(`${y}-${m}-${d}`);
    if (isNaN(end)) return null;
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
}

function PolicyCard({ policy }) {
    const {
        plcyNm,           // 정책명
        category,         // 분야
        plcySprtCn,       // 지원 내용
        plcyExplnCn,      // 정책 설명
        ptcpPrpTrgtCn,    // 참여 대상
        aplyUrlAddr,      // 신청 URL
        aplyPrdSeCd,      // 신청기간 구분
        bizPrdEndYmd,     // 사업 종료일
        sprtTrgtMinAge,
        sprtTrgtMaxAge,
        sprtTrgtAgeLmtYn,
    } = policy;

    const style = CATEGORY_STYLE[category] ?? { color: "var(--primary)", bg: "var(--primary-light)" };
    const description = plcySprtCn || plcyExplnCn;

    // D-day 계산
    let ddayLabel = null;
    if (aplyPrdSeCd === "상시모집") {
        ddayLabel = "상시모집";
    } else if (aplyPrdSeCd === "마감") {
        ddayLabel = "마감";
    } else if (bizPrdEndYmd) {
        const d = calcDday(bizPrdEndYmd);
        if (d !== null) ddayLabel = d >= 0 ? `D-${d}` : "마감";
    }

    // 태그 빌드
    const tags = [];
    if (sprtTrgtAgeLmtYn === "Y" && sprtTrgtMinAge && sprtTrgtMaxAge) {
        tags.push(`만 ${sprtTrgtMinAge}~${sprtTrgtMaxAge}세`);
    }
    if (ptcpPrpTrgtCn) tags.push(ptcpPrpTrgtCn.slice(0, 20));

    const url = aplyUrlAddr?.trim();

    return (
        <div className="policy-card">
            <div className="policy-card-top">
                <span
                    className="policy-card-category"
                    style={{ color: style.color, background: style.bg }}
                >
                    {category}
                </span>
                {ddayLabel && (
                    <span className={`policy-card-dday${ddayLabel === "상시모집" || ddayLabel === "마감" ? " always-open" : ""}`}>
                        {ddayLabel}
                    </span>
                )}
            </div>

            {plcyNm && <div className="policy-card-title">{plcyNm}</div>}
            {description && <p className="policy-card-desc">{description}</p>}

            {tags.length > 0 && (
                <div className="policy-card-tags">
                    {tags.map(tag => (
                        <span key={tag} className="policy-card-tag">{tag}</span>
                    ))}
                </div>
            )}

            <div className="policy-card-footer">
                <span />
                {url ? (
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
