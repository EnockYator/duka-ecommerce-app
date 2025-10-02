"use strict"

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from 'axios';


const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    accessToken: null,
    error: null,
};

export const registerUser = createAsyncThunk(
    "/auth/register",
    
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "http://localhost:5000/api/auth/register",
                formData
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Registration failed" });
        }
    }
);

export const loginUser = createAsyncThunk(
    "/auth/login",
    
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "http://localhost:5000/api/auth/login",
                formData
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Login failed" });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isLoading = false;
            state.error = null;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLoading = false;
            state.error = null;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = 
                    action.payload?.errors?.email ||
                    action.payload?.errors?.userName ||
                    action.payload?.errors?.password ||
                    action.payload?.general ||
                    action.payload?.message ||
                    "Registration failed";
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = 
                    action.payload?.errors?.email ||
                    action.payload?.errors?.userName ||
                    action.payload?.errors?.password ||
                    action.payload?.general ||
                    action.payload?.message ||
                    "Login failed";
            })
    }
});

export const {setUser, setCredentials, clearCredentials, setAuthError} = authSlice.actions;
export default authSlice.reducer;