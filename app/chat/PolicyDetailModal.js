"use client"

import { createPortal } from "react-dom";
import {
    categoryStyle,
    getDdayInfo,
    getUrgencyLevel,
    formatApplyPeriod,
    ELIGIBILITY_STATUS,
    CONDITION_STATUS_ICON,
} from "@/utils/policy";

// D-Day 텍스트 색상 — 마감임박 빨강 / 진행중 주황 / 마감됨·상시 회색
function ddayTextColor(urgencyLevel, muted) {
    if (muted || urgencyLevel === "expired" || urgencyLevel === "always") return "var(--text-muted)";
    if (urgencyLevel === "urgent") return "#E5484D";
    return "#F59E3C";
}
import { useSavedPolicies } from "@/contexts/SavedPoliciesContext";
import { CloseIcon } from "@/app/components/CloseIcon";

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
        eligibility,      // 자격 검증 결과 (상세조회 로그인 유저에게만 존재)
    } = policy;

    // 자격 검증 배지 정보 (status가 매핑에 없으면 섹션을 렌더하지 않음)
    const eligibilityStatus = eligibility && ELIGIBILITY_STATUS[eligibility.status];

    const style = categoryStyle(category);
    const dday = getDdayInfo(policy);
    const ddayColor = ddayTextColor(getUrgencyLevel(policy), dday?.muted);
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

    // 모달은 body로 포털링한다. 메시지 말풍선(.message-row.bot) 같은 flex/transform
    // 컨테이너 안에서 렌더되면 position:fixed 기준이 뷰포트가 아니게 되어
    // 오버레이가 화면 전체를 덮지 못하는 문제가 생길 수 있다.
    if (typeof document === "undefined") return null;

    return createPortal(
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
                        <button className="modal-close-btn" onClick={onClose}>
                            <CloseIcon size={16} />
                        </button>
                    </div>
                    <h3 className="policy-detail-title">{plcyNm}</h3>
                    {dday && (
                        <span className="policy-detail-dday" style={{ color: ddayColor }}>
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

                    {/* 자격 검증 — 정책 상세 하단에 Divider로 구분해 별도 섹션으로 표시 */}
                    {eligibilityStatus && (
                        <div className="policy-eligibility">
                            <hr className="policy-eligibility-divider" />
                            <h4 className="policy-eligibility-heading">자격 검증</h4>

                            <div className={`policy-eligibility-verdict tone-${eligibilityStatus.tone}`}>
                                <span className="policy-eligibility-verdict-label">신청 가능 여부</span>
                                <span className="policy-eligibility-verdict-badge">
                                    {eligibilityStatus.icon} {eligibilityStatus.label}
                                </span>
                            </div>

                            {eligibility.items?.length > 0 && (
                                <div className="policy-eligibility-block">
                                    <div className="policy-eligibility-subheading">조건별 검증 결과</div>
                                    <ul className="policy-eligibility-list">
                                        {eligibility.items.map((item) => (
                                            <li key={item.label} className="policy-eligibility-item">
                                                <span className="policy-eligibility-item-icon">
                                                    {CONDITION_STATUS_ICON[item.status] ?? "⚠️"}
                                                </span>
                                                <span className="policy-eligibility-item-label">{item.label}</span>
                                                <span className="policy-eligibility-item-detail">
                                                    (요건: {item.requirement} / 사용자: {item.userValue})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {eligibility.summary && (
                                <div className="policy-eligibility-block">
                                    <div className="policy-eligibility-subheading">종합 결과</div>
                                    <p className="policy-eligibility-summary">{eligibility.summary}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="policy-detail-footer">
                    {enabled && (
                        // 저장 토글: 안 담겼으면 담고 캘린더를 연다. 이미 담겼으면 저장을 취소한다.
                        <button
                            className={`policy-detail-save-btn ${saved ? "saved" : ""}`}
                            onClick={() => {
                                toggle(policy);
                                if (!saved) openCalendar();  // 새로 저장할 때만 캘린더 열기
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                            </svg>
                            {saved ? "저장됨" : "저장"}
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
        </div>,
        document.body
    );
}

export default PolicyDetailModal;
