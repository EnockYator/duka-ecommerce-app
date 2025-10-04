"use strict"

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../../axios';


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
                import.meta.env.VITE_API_BASE_URL + "/api/auth/register" || 
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
                import.meta.env.VITE_API_BASE_URL + "/api/auth/login" || 
                "http://localhost:5000/api/auth/login",
                formData
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Login failed" });
        }
    }
);

export const logoutUser = createAsyncThunk(
    "/auth/logout",
    
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                import.meta.env.VITE_API_BASE_URL + "/api/auth/logout" || 
                "http://localhost:5000/api/auth/logout"
            );
            localStorage.removeItem('accessToken'); // Clear token
            return res.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Logout failed" });
        }
    }
);

export const attemptRefresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/refresh" || 
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true } // allows cookies for refresh token
      );

      // Return the new tokens/user from backend
      return res.data; // expected: { user, accessToken }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Refresh failed" });
    }
  }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user || null
            state.isAuthenticated = !!state.user;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user || null;
            state.accessToken = action.payload.accessToken || null;
            state.message = action.payload.message || null;
            state.isAuthenticated = !!state.user;
            state.isLoading = false;
            state.error = null;
        },
        clearCredentials: (state, action) => {
            state.user = null;
            state.accessToken = null;
            state.isLoading = false;
            state.isAuthenticated = false;
            state.error = null;
            state.message = action.payload.message || null;
        },
        setAuthError: (state, action) => {
            state.error = action.payload.error;
            state.isLoading = false;
        },
        // for sonner toast notifications
        clearMessages: (state) => {
            state.message = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.message = action.payload.message || null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
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
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user, accessToken } = action.payload;
                state.isLoading = false;
                state.user = user || null;
                state.accessToken = accessToken || null;
                state.error = null;
                state.isAuthenticated = !!user;
                state.message = action.payload.message || null;
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
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
                state.message = action.payload.message || null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 
                    action.payload?.message || 
                    "Logout failed";
            })
            // Refresh start
            .addCase(attemptRefresh.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // Refresh success
            .addCase(attemptRefresh.fulfilled, (state, action) => {
                const { user, accessToken } = action.payload;
                state.user = user || null;
                state.accessToken = accessToken || null;
                state.isAuthenticated = !!user;
                state.isLoading = false;
                state.message = action.payload.message || null;
            })
            // Refresh failed
            .addCase(attemptRefresh.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
                state.isLoading = false;
                state.error = action.payload?.message || 
                    "Token refresh failed";
            });

    },
});

export const {setUser, setCredentials, clearCredentials, setAuthError, clearMessages} = authSlice.actions;
export default authSlice.reducer;