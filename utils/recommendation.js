/**
 * 정책추천 의도 전용 표현 유틸.
 *
 * 백엔드는 추천 순서(policies 배열 순서)만 주고 매칭 점수를 주지 않는다.
 * 점수는 순위에서 파생하는 표현용 값이며, 정렬/필터의 근거로 쓰면 안 된다.
 */
import { getDdayInfo, getDdayNumber } from "@/utils/policy";

/**
 * 순위(0-based) → 매칭 점수. 1위 95점에서 시작해 순위마다 완만히 감소.
 * 백엔드 점수가 생기면 이 함수만 교체하면 된다.
 */
export function getMatchScore(rankIndex) {
    if (rankIndex === 0) return 95;
    return Math.max(55, 94 - rankIndex * 6);
}

// 금액 하이라이트 추출용 — "월 40만원", "최대 30만원", "연 13만원" 등
const AMOUNT_REGEX = /(?:(?:월|연간?|매월|최대|총)\s*)*[\d,]+(?:\.\d+)?\s*(?:억|만)\s*원(?:\s*(?:지원|지급|적립))?/g;

/**
 * 정책 텍스트에서 대표 혜택(금액) 문구를 뽑는다.
 * "최대"가 붙은 금액을 우선하고, 없으면 첫 금액. 금액이 없으면 null.
 */
export function extractBenefitHighlight(policy) {
    if (!policy) return null;
    const source = [policy.plcySprtCnSummary, policy.plcySprtCn, policy.plcyExplnCn]
        .filter(Boolean)
        .join("\n");
    const matches = source.match(AMOUNT_REGEX);
    if (!matches?.length) return null;
    const preferred = matches.find(m => m.includes("최대")) ?? matches[0];
    return preferred.replace(/\s+/g, " ").trim();
}

/** D-day 라벨을 목록 메타용 문구로 변환 ("상시" → "상시모집"). */
export function formatDdayForMeta(policy) {
    const dday = getDdayInfo(policy);
    if (!dday) return null;
    return dday.label === "상시" ? "상시모집" : dday.label;
}

/**
 * 목록 행에 붙는 한 줄 요약 혜택.
 * 금액 하이라이트 우선, 없으면 지원 내용 첫 구절을 잘라 쓴다.
 */
export function getShortBenefit(policy, maxLength = 22) {
    const highlight = extractBenefitHighlight(policy);
    if (highlight) return highlight;
    const text = (policy?.plcySprtCnSummary || policy?.plcyExplnCn || policy?.plcySprtCn || "")
        .split("\n")[0]
        .trim();
    if (!text) return null;
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * 마감임박순 정렬 키 — 마감 있는 정책(임박순) → 상시 → 이미 마감된 정책.
 * ranked 아이템({ policy, score }) 배열을 받아 새 배열을 반환한다(원본 불변).
 */
export function sortByDeadline(ranked) {
    const key = ({ policy }) => {
        const days = getDdayNumber(policy);
        if (days === null) return [1, 0];        // 상시 — 마감 있는 정책 뒤
        if (days < 0) return [2, -days];         // 마감됨 — 맨 뒤, 오래된 순
        return [0, days];                        // 임박한 순
    };
    return [...ranked].sort((a, b) => {
        const [ga, da] = key(a);
        const [gb, db] = key(b);
        return ga !== gb ? ga - gb : da - db;
    });
}
