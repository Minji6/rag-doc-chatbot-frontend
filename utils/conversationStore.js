/**
 * 대화 히스토리 영속화 도메인 계층.
 *
 * - 제목 캐시: 게스트·유저 공용. 사이드바가 UUID 대신 "질문 앞부분"을 보여주도록,
 *   백엔드가 제목을 내려주지 않는 한계를 클라이언트에서 보완한다.
 * - 게스트 히스토리: 백엔드에 영속 신원이 없으므로 localStorage가 단일 출처.
 *   (유저는 백엔드 checkpoints가 출처이고, 여기선 제목만 보강한다.)
 *
 * ChatContext가 이 모듈에만 의존하도록 모아 저장소 구현을 캡슐화한다.
 */
import { loadJSON, saveJSON, removeKey } from "@/utils/storage";

const TITLES_KEY     = "cheongpodo:titles";       // { [conversationId]: title }
const GUEST_IDS_KEY  = "cheongpodo:guest:ids";    // [id, ...] 최신순
const GUEST_MSG_KEY  = (id) => `cheongpodo:guest:msgs:${id}`;

const TITLE_MAX_LEN = 20;

/** 첫 사용자 질문에서 사이드바 제목을 파생한다. */
export function deriveTitle(text) {
    const trimmed = (text || "").trim().replace(/\s+/g, " ");
    return trimmed.slice(0, TITLE_MAX_LEN) || "새 대화";
}

// ----- 제목 캐시 (게스트·유저 공용) -----------------------------------------

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

function forgetTitle(conversationId) {
    const titles = loadTitles();
    if (!(conversationId in titles)) return;
    delete titles[conversationId];
    saveJSON(TITLES_KEY, titles);
}

/** [{conversation_id}] 목록에 캐시된 제목을 붙여 반환. */
export function withTitles(conversations) {
    const titles = loadTitles();
    return conversations.map((c) => ({
        ...c,
        title: c.title ?? titles[c.conversation_id] ?? "새 대화",
    }));
}

// ----- 게스트 히스토리 (localStorage 단일 출처) ------------------------------

/** 게스트 대화 목록을 최신순으로 반환 [{conversation_id, title}]. */
export function loadGuestConversations() {
    const ids = loadJSON(GUEST_IDS_KEY, []);
    return withTitles(ids.map((id) => ({ conversation_id: id })));
}

/** 특정 게스트 대화의 메시지(정책 카드 메타 포함)를 복원. */
export function loadGuestMessages(conversationId) {
    return loadJSON(GUEST_MSG_KEY(conversationId), []);
}

/**
 * 게스트 대화 1턴을 저장한다. 목록 상단으로 끌어올리고 메시지 전체를 갱신.
 * @returns {string} 확정된 제목 (목록 즉시 반영용)
 */
export function saveGuestConversation(conversationId, messages) {
    saveJSON(GUEST_MSG_KEY(conversationId), messages);

    const firstUser = messages.find((m) => m.role === "user");
    const title = deriveTitle(firstUser?.content);
    rememberTitle(conversationId, title);

    const ids = loadJSON(GUEST_IDS_KEY, []).filter((id) => id !== conversationId);
    ids.unshift(conversationId); // 최근 대화를 맨 앞으로
    saveJSON(GUEST_IDS_KEY, ids);

    return title;
}

/** 게스트 대화 1건을 목록·메시지·제목에서 모두 제거. */
export function deleteGuestConversation(conversationId) {
    const ids = loadJSON(GUEST_IDS_KEY, []).filter((id) => id !== conversationId);
    saveJSON(GUEST_IDS_KEY, ids);
    removeKey(GUEST_MSG_KEY(conversationId));
    forgetTitle(conversationId);
}
