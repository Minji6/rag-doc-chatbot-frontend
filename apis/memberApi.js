import axios from "axios";

// 전체 유저 목록 조회
function getUsers() {
    return axios.get("/api/auth/users");
}

// 유저 생성
function createUser(userData) {
    return axios.post("/api/auth/users", userData);
}

// 유저 삭제
function deleteUser(userId) {
    return axios.delete(`/api/auth/users/${userId}`);
}

export default {
    getUsers,
    createUser,
    deleteUser,
};
