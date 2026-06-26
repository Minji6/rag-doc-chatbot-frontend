import axios from "axios";

// 채팅 메시지 전송
function sendChat(message, conversation_id, role = "guest", user_id = null, attach = null) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("conversation_id", conversation_id);
    formData.append("role", role);
    if (user_id !== null) formData.append("user_id", user_id);
    if (attach !== null) formData.append("attach", attach);
    return axios.post("/api/chat/service", formData);
}

// 대화 히스토리 조회
function getHistory(conversation_id, role = "guest", user_id = null) {
    return axios.get("/chat_history/get-history", {
        params: {
            conversation_id,
            role,
            ...(user_id !== null && { user_id }),
        },
    });
}

// 대화 히스토리 삭제
function clearHistory(conversation_id, role = "guest", user_id = null) {
    return axios.delete("/chat_history/clear-history", {
        params: {
            conversation_id,
            role,
            ...(user_id !== null && { user_id }),
        },
    });
}

export default { sendChat, getHistory, clearHistory };
