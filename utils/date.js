/**
 * 특정 날짜까지 남은 일수를 계산해 D-day 문자열로 반환
 * @param {string|number} deadline - bizPrdEndYmd (예: "20251231")
 * @param {string} [aplyPrdSeCd] - 신청기간구분코드: "특정기간" | "상시" | "마감"
 * @returns {string} "D-30" | "D-Day" | "마감" | "상시"
 */
export function calculateDday(deadline, aplyPrdSeCd) {
    if (aplyPrdSeCd === "상시") return "상시";
    if (aplyPrdSeCd === "마감") return "마감";
    if (!deadline || !String(deadline).trim()) return "상시";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 20250807 형식 처리
    const str = String(deadline).trim();
    const normalized = str.length === 8
        ? `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`
        : str;

    const target = new Date(normalized);
    target.setHours(0, 0, 0, 0);

    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-Day";
    return "마감";
}
