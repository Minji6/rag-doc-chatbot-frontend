import { categoryStyle, getDdayInfo } from "@/utils/policy";

/**
 * 정책 요약 카드 (목록용).
 *
 * - 게스트: 푸터의 "자세히 보기 →"가 외부 신청 URL로 직접 이동한다.
 * - 로그인 유저: onDetail 콜백이 주입되면 "자세히 보기 →"가 상세 모달을 연다.
 *   (로그인 유저에게만 모달 진입점을 노출하라는 요구사항을 onDetail 유무로 표현)
 */
function PolicyCard({ policy, onDetail }) {
    const {
        plcyNm,           // 정책명
        category,         // 분야
        plcySprtCn,       // 지원 내용
        plcyExplnCn,      // 정책 설명
        ptcpPrpTrgtCn,    // 참여 대상
        aplyUrlAddr,      // 신청 URL
        sprtTrgtMinAge,
        sprtTrgtMaxAge,
        sprtTrgtAgeLmtYn,
    } = policy;

    const style = categoryStyle(category);
    const description = plcySprtCn || plcyExplnCn;
    const dday = getDdayInfo(policy);

    // 태그 빌드 — 연령 제한이 명시된 정책만 나이 범위를 노출.
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
                {dday && (
                    <span className={`policy-card-dday${dday.muted ? " always-open" : ""}`}>
                        {dday.label}
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
                {onDetail ? (
                    // 로그인 유저: 상세 모달 진입
                    <button type="button" className="policy-card-link" onClick={() => onDetail(policy)}>
                        자세히 보기 →
                    </button>
                ) : url ? (
                    // 게스트: 외부 신청 URL로 직접 이동
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
