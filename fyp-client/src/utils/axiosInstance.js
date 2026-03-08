import axios from "axios";
import { API_BASE_URL } from "@config";
import { readLocalStorage, showErrorToast, showSuccessToast } from "@utils";

// create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL + "/api",
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    showToast: true,
    showSuccessToast: true,
    showErrorToast: true
});

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = readLocalStorage("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.showToast && response.config.showSuccessToast) {
            showSuccessToast(response.message ?? (response?.data?.message ?? "Request was successfull"));
        }
        return response;
    },
    (error) => {
        if (error.config?.showToast && error.config?.showErrorToast) {
            showErrorToast(error.response?.data?.message ?? (error.message ?? "Something went wrong"));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
