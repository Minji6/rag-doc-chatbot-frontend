/**
 * 긴 문자열을 일정 길이로 잘라 말줄임표(…)로 반환
 * @param {string} text - 원본 문자열
 * @param {number} maxLength - 최대 글자 수
 * @returns {string}
 */
export function truncateText(text, maxLength = 40) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
}
