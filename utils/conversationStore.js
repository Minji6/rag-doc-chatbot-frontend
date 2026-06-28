/**
 * 대화 제목 캐시 (유저 전용 보조 계층).
 *
 * 백엔드 get_conversations는 conversation_id만 내려주므로, 사이드바가 UUID 대신
 * "질문 앞부분"을 보여주도록 클라이언트에서 제목만 캐시한다.
 *
 * 주의: 게스트 히스토리는 백엔드가 InMemorySaver(휘발성)로 설계했으므로
 * 의도적으로 영속화하지 않는다. 여기서도 게스트 대화는 저장하지 않는다.
 */
import { loadJSON, saveJSON, removeKey } from "@/utils/storage";

const TITLES_KEY = "cheongpodo:titles"; // { [conversationId]: title }
const TITLE_MAX_LEN = 20;

/** 첫 사용자 질문에서 사이드바 제목을 파생한다. */
export function deriveTitle(text) {
    const trimmed = (text || "").trim().replace(/\s+/g, " ");
    return trimmed.slice(0, TITLE_MAX_LEN) || "새 대화";
}

function loadTitles() {
    return loadJSON(TITLES_KEY, {});
}

/** 아직 제목이 없을 때만 기록한다 (첫 메시지 = 제목 확정). */
export function rememberTitle(conversationId, title) {
    const titles = loadTitles();
    if (titles[conversationId]) return;
    titles[conversationId] = title;
    saveJSON(TITLES_KEY, titles);
}

/** 대화 삭제 시 제목 캐시도 정리. 남으면 빈 항목이 무한정 쌓인다. */
export function forgetTitle(conversationId) {
    const titles = loadTitles();
    if (!(conversationId in titles)) return;
    delete titles[conversationId];
    saveJSON(TITLES_KEY, titles);
    if (Object.keys(titles).length === 0) removeKey(TITLES_KEY);
}

/** [{conversation_id}] 목록에 캐시된 제목을 붙여 반환. */
export function withTitles(conversations) {
    const titles = loadTitles();
    return conversations.map((c) => ({
        ...c,
        title: c.title ?? titles[c.conversation_id] ?? "새 대화",
    }));
}
