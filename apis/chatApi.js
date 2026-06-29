import axios from "axios";

// 챗봇 메시지 전송 (attach: 첨부 이미지 File, 선택)
function sendChat(message, conversation_id, role = "guest", user_id = null, attach = null) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("conversation_id", conversation_id);
    formData.append("role", role);
    if (user_id !== null) formData.append("user_id", user_id);
    // 백엔드 /api/chat/service 는 multipart의 attach(UploadFile)로 이미지를 받는다
    if (attach) formData.append("attach", attach);
    return axios.post("/api/chat/service", formData);
}

// 대화 내용 조회
function getHistory(conversation_id, role = "guest", user_id = null) {
    const params = { conversation_id, role };
    if (user_id !== null) params.user_id = user_id;
    return axios.get("/chat_history/get-history", { params });
}

// 유저별 대화 목록 조회
function getConversations(user_id) {
    return axios.get("/chat_history/conversations", { params: { user_id } });
}

// 대화 삭제
function clearHistory(conversation_id, role = "guest", user_id = null) {
    const params = { conversation_id, role };
    if (user_id !== null) params.user_id = user_id;
    return axios.delete("/chat_history/clear-history", { params });
}

export default { sendChat, getHistory, getConversations, clearHistory };
