/**
 * 정책추천(추천) 의도 전용 표현 유틸.
 *
 * 백엔드가 추천 의도일 때 각 정책에 suitability_score(벡터 유사도 기반 0~100 적합도)를
 * 실어 보낸다(welfare/housing/education/employment search node 공통).
 * 단, 검색 결과가 부족해 웹 검색으로 보완된 정책 등은 벡터 점수가 없을 수 있어
 * 그 경우에만 추천 순서 기반 근사치로 폴백한다.
 */
import { getDdayInfo, getDdayNumber } from "@/utils/policy";

/**
 * 정책의 매칭 점수. policy.suitability_score(백엔드 적합도)가 있으면 그대로 쓰고,
 * 없으면(웹 검색 보완 등) 추천 순서(rankIndex, 0-based) 기반 근사치로 폴백한다.
 */
export function getMatchScore(policy, rankIndex = 0) {
    const score = policy?.suitability_score;
    if (typeof score === "number" && !Number.isNaN(score)) {
        return Math.round(Math.max(0, Math.min(100, score)));
    }
    return rankIndex === 0 ? 95 : Math.max(55, 94 - rankIndex * 6);
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
    // getDdayNumber는 aplyPrdSeCd가 "상시"·"마감" 둘 다 null을 반환해 구분이 안 되므로
    // (utils/policy.js의 getDeadlineDate가 두 값 모두 단락 처리),
    // 리터럴 상태값을 먼저 보고 날짜 기반 계산은 그 외(기간 지정)에만 쓴다.
    const key = ({ policy }) => {
        const status = (policy?.aplyPrdSeCd || "").trim();
        if (status === "마감") return [2, 0];    // 마감됨 — 맨 뒤
        if (status === "상시") return [1, 0];    // 상시 — 마감 있는 정책 뒤
        const days = getDdayNumber(policy);
        if (days === null) return [1, 0];        // 알 수 없음 — 상시와 동일 취급
        if (days < 0) return [2, -days];         // 날짜상 지남 — 맨 뒤, 오래된 순
        return [0, days];                        // 임박한 순
    };
    return [...ranked].sort((a, b) => {
        const [ga, da] = key(a);
        const [gb, db] = key(b);
        return ga !== gb ? ga - gb : da - db;
    });
}
