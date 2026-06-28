"use client"

import { categoryStyle, getDdayInfo, formatApplyPeriod } from "@/utils/policy";
import { useSavedPolicies } from "@/contexts/SavedPoliciesContext";

/**
 * 정책 상세 모달 (로그인 유저가 카드의 "자세히 보기"를 눌렀을 때).
 *
 * 기존 modal-overlay/모달 닫기 패턴(UserProfileModal)을 그대로 따른다.
 * 백엔드 정책 메타에 실제로 존재하는 필드만 조건부로 렌더하므로,
 * 값이 없는 섹션은 통째로 숨겨 빈 라벨이 노출되지 않는다.
 */
function PolicyDetailModal({ policy, onClose }) {
    const { enabled, isSaved, toggle, openCalendar } = useSavedPolicies();

    if (!policy) return null;

    const saved = enabled && isSaved(policy);

    const {
        plcyNm,           // 정책명
        category,         // 분야
        sub_category,     // 세부 분야
        plcySprtCn,       // 지원 내용
        plcyExplnCn,      // 정책 설명
        ptcpPrpTrgtCn,    // 지원 대상
        addAplyQlfcCndCn, // 추가 신청 자격 조건
        aplyUrlAddr,      // 신청 URL
    } = policy;

    const style = categoryStyle(category);
    const dday = getDdayInfo(policy);
    const applyPeriod = formatApplyPeriod(policy);
    const url = aplyUrlAddr?.trim();

    // (라벨, 값) 쌍 — 값이 있는 항목만 정의 리스트로 렌더한다.
    const fields = [
        ["지원 내용", plcySprtCn],
        ["정책 설명", plcyExplnCn],
        ["지원 대상", ptcpPrpTrgtCn],
        ["추가 자격 조건", addAplyQlfcCndCn],
        ["신청 기간", applyPeriod],
        ["세부 분야", sub_category],
    ].filter(([, value]) => value && String(value).trim());

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="policy-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div
                    className="policy-detail-header"
                    style={{ background: style.bg }}
                >
                    <div className="policy-detail-header-top">
                        <span
                            className="policy-card-category"
                            style={{ color: style.color, background: "var(--surface)" }}
                        >
                            {category}
                        </span>
                        <button className="modal-close-btn" onClick={onClose}>✕</button>
                    </div>
                    <h3 className="policy-detail-title">{plcyNm}</h3>
                    {dday && (
                        <span className={`policy-detail-dday${dday.muted ? " always-open" : ""}`}>
                            {dday.label}
                        </span>
                    )}
                </div>

                <div className="policy-detail-body">
                    {fields.map(([label, value]) => (
                        <div key={label} className="policy-detail-field">
                            <div className="policy-detail-label">{label}</div>
                            <p className="policy-detail-value">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="policy-detail-footer">
                    {enabled && (
                        // 저장: 캘린더에 담고 패널을 연다. 이미 담겼으면 캘린더만 연다.
                        <button
                            className={`policy-detail-save-btn ${saved ? "saved" : ""}`}
                            onClick={() => {
                                if (!saved) toggle(policy);
                                openCalendar();
                            }}
                        >
                            {saved ? "🔖 저장됨" : "🔖 저장"}
                        </button>
                    )}
                    {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="policy-detail-apply-btn"
                        >
                            신청하러 가기 ↗
                        </a>
                    ) : (
                        <span className="policy-detail-apply-btn disabled">
                            신청 링크 없음
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PolicyDetailModal;
