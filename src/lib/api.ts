import { Client } from "@metahkg/api";
import Axios from "axios";

const axios = Axios.create();

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use((response) => {
    if (response.headers.token) localStorage.setItem("token", response.headers.token);
    return response;
});

export const api = new Client("/api", axios);
