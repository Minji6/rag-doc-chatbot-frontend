<<<<<<< HEAD
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:80",
})

export default axiosInstance
=======
"use client"

import axios from "axios";

axios.defaults.baseURL = "http://localhost:80";

function AxiosConfig() {
    return null;
}

export default AxiosConfig;
>>>>>>> add014d870ae8ea79fa8945bc538ca6618503a5c
