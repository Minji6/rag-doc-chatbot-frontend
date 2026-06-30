/**
 * 정책 카드/상세 모달이 공유하는 표현(presentation) 유틸.
 *
 * 이전엔 CATEGORY_STYLE과 D-day 계산이 PolicyCard·BotMessage·utils/date 에
 * 흩어져 중복돼 있었다(값도 "상시모집" vs "상시"로 어긋남). 단일 출처로 모은다.
 */
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

// 날짜 표기(YYYYMMDD / YYYY.MM.DD / YYYY-MM-DD)를 모두 매칭. 전역 플래그라 사용 전 lastIndex 리셋.
const _DATE_RE = /(\d{4})[.\-]?(\d{2})[.\-]?(\d{2})/g;

/**
 * 정책의 신청기간(aplyYmd)·사업종료일(bizPrdEndYmd) 문자열에서 날짜를 모두 뽑아
 * 가장 늦은 날짜(=마감일)를 Date로 반환한다. 마감일의 단일 출처.
 *
 * 이전엔 bizPrdEndYmd만 봤는데, 실제 신청 마감일은 대부분 aplyYmd(기간 범위)에 있고
 * bizPrdEndYmd는 비어있는 경우가 많아 "상시"/"마감"으로 잘못 표시됐다(백엔드 dday_label과 동일 로직).
 */
function parseDeadlineDate(policy) {
    const text = `${policy?.aplyYmd ?? ""} ${policy?.bizPrdEndYmd ?? ""}`;
    let latest = null;
    _DATE_RE.lastIndex = 0;
    let m;
    while ((m = _DATE_RE.exec(text)) !== null) {
        const d = new Date(`${m[1]}-${m[2]}-${m[3]}`);
        if (!isNaN(d)) {
            d.setHours(0, 0, 0, 0);
            if (latest === null || d > latest) latest = d;
        }
    }
    return latest;
}

/**
 * 정책의 신청 마감 상태를 배지용 정보로 변환한다.
 * @param {object} policy - 백엔드 정책 메타 (aplyPrdSeCd, aplyYmd, bizPrdEndYmd 사용)
 * @returns {{ label: string, muted: boolean } | null}
 *   label  - "D-30" | "D-Day" | "마감" | "상시"
 *   muted  - 상시/마감처럼 긴급도 색을 빼야 하는 경우 true
 */
export function getDdayInfo(policy) {
    if (!policy) return null;
    const se = (policy.aplyPrdSeCd || "").trim();
    if (se === "상시") return { label: "상시", muted: true };
    if (se === "마감") return { label: "마감", muted: true };
    const days = getDdayNumber(policy);
    if (days === null) return { label: "상시", muted: true };  // 마감일 정보 없음 → 상시로 표시
    if (days < 0) return { label: "마감", muted: true };
    if (days === 0) return { label: "D-Day", muted: false };
    return { label: `D-${days}`, muted: false };
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

/** 정책 마감일을 Date로 반환 (aplyYmd+bizPrdEndYmd 중 가장 늦은 날짜). 상시/마감/날짜없음이면 null. */
export function getDeadlineDate(policy) {
    if (!policy) return null;
    const se = (policy.aplyPrdSeCd || "").trim();
    if (se === "상시" || se === "마감") return null;
    return parseDeadlineDate(policy);
}

/** 마감까지 남은 일수(정수). 상시/마감/형식오류면 null. */
export function getDdayNumber(policy) {
    const date = getDeadlineDate(policy);
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor((date - today) / 86_400_000);
}

// 마감 임박도 단계 — 캘린더 하이라이트/범례 색의 단일 출처.
export const URGENCY = {
    urgent:  { label: "긴급", color: "#E5484D" },  // D-7 이하
    soon:    { label: "임박", color: "#F59E3C" },  // D-21 이하
    relaxed: { label: "여유", color: "#5AA82C" },  // 그 외
    expired: { label: "마감", color: "#9AA0A6" },  // 마감일 지남 — 회색
    always:  { label: "상시", color: "#4A90D9" },  // 마감 없음(상시모집) — 파랑
};

/**
 * D-Day 배지 인라인 스타일 — 달력 범례(URGENCY)와 같은 단일 출처에서 색을 가져온다.
 * 표시 라벨(상시/마감)을 우선해 라벨↔색을 항상 일치시키고, 나머지는 urgencyLevel을 쓴다.
 * @param {string} label        - getDdayInfo의 label ("상시" | "마감" | "D-30" 등)
 * @param {string} urgencyLevel - getUrgencyLevel의 반환 키 (urgent|soon|relaxed|expired|always)
 */
export function getDdayBadgeStyle(label, urgencyLevel) {
    const key = label === "상시" ? "always"
        : label === "마감" ? "expired"
        : urgencyLevel;
    const color = (URGENCY[key] ?? URGENCY.always).color;
    return { background: `${color}1A`, color };  // 색상 + 10% 투명 배경
}

/**
 * 정책의 임박도 단계 키를 반환 (URGENCY의 키).
 * 마감일이 지난 정책은 "expired"로 분리한다 — getDdayInfo가 같은 정책을 "마감"
 * 배지로 표시하므로, 이를 "always"(상시 회색)로 묶으면 도트/테두리 색과
 * 배지 의미가 어긋난다.
 */
export function getUrgencyLevel(policy) {
    const days = getDdayNumber(policy);
    if (days === null) return "always";
    if (days < 0) return "expired";
    if (days <= 7) return "urgent";
    if (days <= 21) return "soon";
    return "relaxed";
}
