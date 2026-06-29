/**
 * 정책 카드/상세 모달이 공유하는 표현(presentation) 유틸.
 *
 * 이전엔 CATEGORY_STYLE과 D-day 계산이 PolicyCard·BotMessage·utils/date 에
 * 흩어져 중복돼 있었다(값도 "상시모집" vs "상시"로 어긋남). 단일 출처로 모은다.
 */
import { calculateDday } from "@/utils/date";

// 분야별 배지 색상. category 값이 매핑에 없으면 기본 primary 색을 쓴다.
export const CATEGORY_STYLE = {
    복지문화: { color: "var(--color-welfare)",   bg: "var(--color-welfare-bg)" },
    주거:     { color: "var(--color-housing)",   bg: "var(--color-housing-bg)" },
    교육:     { color: "var(--color-education)", bg: "var(--color-education-bg)" },
    일자리:   { color: "var(--color-job)",       bg: "var(--color-job-bg)" },
};

// category 값으로 배지 스타일을 안전하게 조회 (미매핑 시 기본값).
export function categoryStyle(category) {
    return CATEGORY_STYLE[category] ?? { color: "var(--primary)", bg: "var(--primary-light)" };
}

/**
 * 정책의 신청 마감 상태를 배지용 정보로 변환한다.
 * @param {object} policy - 백엔드 정책 메타 (bizPrdEndYmd, aplyPrdSeCd 사용)
 * @returns {{ label: string, muted: boolean } | null}
 *   label  - "D-30" | "D-Day" | "마감" | "상시"
 *   muted  - 상시/마감처럼 긴급도 색을 빼야 하는 경우 true
 */
export function getDdayInfo(policy) {
    if (!policy) return null;
    const label = calculateDday(policy.bizPrdEndYmd, policy.aplyPrdSeCd);
    if (!label) return null;
    const muted = label === "상시" || label === "마감";
    return { label, muted };
}

/**
 * 정책의 신청 기간 표시 문자열.
 * aplyYmd 원문이 있으면 우선, 없으면 사업 시작~종료일을 조합한다.
 */
export function formatApplyPeriod(policy) {
    if (!policy) return "";
    const raw = policy.aplyYmd?.trim();
    if (raw) return raw;
    const begin = policy.bizPrdBgngYmd?.trim();
    const end = policy.bizPrdEndYmd?.trim();
    if (begin && end) return `${begin} ~ ${end}`;
    return begin || end || "";
}
