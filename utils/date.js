/**
 * 특정 날짜까지 남은 일수를 계산해 D-day 문자열로 반환
 * @param {string} deadline - 마감일 (예: "2025-12-31")
 * @returns {string} "D-30" | "D-Day" | "마감"
 */
export function calculateDday(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(deadline);
    target.setHours(0, 0, 0, 0);

    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-Day";
    return "마감";
}
