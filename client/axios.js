
"use strict"

import axios from "axios";
// import store from "@/store/store";
import { setCredentials, clearCredentials } from "@/store/authSlice";

// create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    withCredentials: true, // send cookies (refresh token) to server
});

// placeholder for injecting store later to avoid circular dependency
let store;

export const injectStore = (_store) => { store = _store };

// attach acces token from redux
axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth?.accessToken;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// handle 401 and try refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// response interceptor
axiosInstance.interceptors.response.use((response) => response, 
async (error) => {
    const originalRequest = error.config;

    // if no response (network), just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            // queue this request while refresh is in progress
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then ((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            }). catch((err) => {
                Promise.reject(err)
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
            // call refresh endpoint (cookie wil be sent)
            // global axios is used here to avoid interceptors on axiosInstance causing recursion
            const res = await axios.post(
                import.meta.env.VITE_API_BASE_URL + "/api/auth/refresh" || 
                "http://localhost:5000/api/auth/refresh",
                {},
                { withCredentials: true }
            );
            
            const {accessToken, user} = res.data || {};
            
            // update Redux with new access token and user
            store.dispatch(setCredentials({ accessToken, user }));
            
            // update request header and retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            processQueue(null, accessToken);
           
            return axiosInstance(originalRequest);
        } catch (err) {
            processQueue(err, null);
            store.dispatch(clearCredentials());
            return Promise.reject(err)           
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error)
});

export default axiosInstance;
