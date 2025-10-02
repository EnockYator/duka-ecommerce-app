/* eslint-disable no-unused-vars */
"use strict"

import axios from "axios"
import axiosInstance from "axios"
import { setAuthError, setCredentials, clearCredentials } from "./auth-slice"

// login thunk
export const loginUser = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            credentials,
            { withCredentials: true } // refresh cookie is set by server
        );
        const { accessToken, user } = res.data;
        
        dispatch(setCredentials({ accessToken, user }));
        return res.data;
    } catch (err) {
        const message = err.response?.data?.errors ||
                        err.respose?.data ||
                        err.message;
        dispatch(setAuthError(message));
        throw err;
    }
};

// refresh thunk - called on app load to attempt to restore session
export const attemptRefresh = () => async (dispatch) => {
    try {
        const res = await axios.post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
        );

        const { accessToken, user } = res.data;

        dispatch(setCredentials({ accessToken, user }));
        return res.data;
    } catch (err) {
        dispatch(clearCredentials());
        return null;
    }
};

// logout thunk
export const logoutUser = () => async (dispatch) => {
    try {
        await axiosInstance.post(
            "/auth/logout"  // clears cookie on server side
        );
    } catch (err) {
        // ignore errors
    } finally {
        dispatch(clearCredentials());
    }
};