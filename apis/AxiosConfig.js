"use client"

import axios from "axios";

// Next.js rewrites가 /api/*, /chat_history/* 를 localhost:80으로 프록시
axios.defaults.baseURL = "";

function AxiosConfig() {
    return null;
}

export default AxiosConfig;
