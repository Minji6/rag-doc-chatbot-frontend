import axios from "axios";

// 챗봇 메시지 전송
function sendChat(message, conversation_id) {
    return axios.post("/api/chat", {
        message,
        conversation_id
    });
}

export default {
    sendChat
};
