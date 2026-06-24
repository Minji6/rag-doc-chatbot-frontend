<<<<<<< HEAD
// sendMessage, getChatRooms
=======
import axios from "axios";

// 챗봇 메시지 전송
function sendChat(message, conversation_id, role = "guest", user_id = null) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("conversation_id", conversation_id);
    formData.append("role", role);
    if (user_id !== null) {
        formData.append("user_id", user_id);
    }
    return axios.post("/api/chat/service", formData);
}

export default {
    sendChat
};
>>>>>>> add014d870ae8ea79fa8945bc538ca6618503a5c
