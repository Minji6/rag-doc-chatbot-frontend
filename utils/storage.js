/**
 * SSR 안전 localStorage JSON 래퍼.
 *
 * Next.js는 서버에서 컴포넌트를 먼저 렌더하므로 window가 없을 수 있다.
 * 모든 접근을 여기서 가드하고 JSON 직렬화를 일원화해, 상위 코드가
 * try/catch·typeof window 체크를 반복하지 않도록 한다.
 */

function hasWindow() {
    return typeof window !== "undefined";
}

/** key의 JSON 값을 파싱해 반환. 없거나 깨졌으면 fallback. */
export function loadJSON(key, fallback = null) {
    if (!hasWindow()) return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

/** value를 JSON으로 저장. 용량 초과 등 실패는 무시(히스토리는 부가 기능). */
export function saveJSON(key, value) {
    if (!hasWindow()) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* QuotaExceeded 등은 조용히 무시 */
    }
}

/** key 삭제. */
export function removeKey(key) {
    if (!hasWindow()) return;
    try {
        window.localStorage.removeItem(key);
    } catch {
        /* noop */
    }
}
