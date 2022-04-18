import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (response.headers.token) {
            localStorage.setItem("token", response.headers.token);
        }
        return response;
    },
    (error) => {
        const code = error && error.response ? error.response.status : 0;
        if (code === 401 || code === 403) {
            console.log("error code", code);
        }
        return Promise.reject(error);
    }
);
