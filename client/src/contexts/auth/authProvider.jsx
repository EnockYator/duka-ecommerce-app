
"use strict"

import { 
    refreshSession, clearCredentials, loginUser,
    logoutUser, registerUser, setAuthError, 
    setCredentials, setUser, clearMessages,
    checkAuth
} from '@/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { AuthContext } from './authContext';
import axiosInstance from './../../../axios';
import { Skeleton } from '@/components/ui/skeleton';

// provider to wrap on app
export function  AuthProvider({ children }) {
    const dispatch = useDispatch();
    
    // get auth state from redux
    const authState = useSelector((state) => state.auth);

    // extract specific values for convinience
    const { user, isAuthenticated, isLoading, error } = authState;

    const refreshTimer = useRef(null);

        
    // Restore session on app mount for consistency across tabs
    useEffect(() => {
        const restoreSession = async () => {
            if (isAuthenticated) return; // already logged in
           
            try {   
                const res = await axiosInstance.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true } // allows cookies for refresh token
                );

                if (res.data?.accessToken) {
                    dispatch(
                        setCredentials({ 
                            accessToken: res.data.accessToken, 
                            user: res.data.user 
                        })
                    );
                }
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                dispatch(clearCredentials());
            }
        };

        restoreSession();
    }, [dispatch, isAuthenticated]);


    // session refresh timer if logged in
    useEffect(() => {
        if (!isAuthenticated) {
            if (refreshTimer.current) {
                clearInterval(refreshTimer.current);
            }
            return;
        }

        // refresh every 10 minutes before access token expires in 15 minutes
        const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

        refreshTimer.current = setInterval(async () => {
            try {
                const res = await axiosInstance.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true } // allows cookies for refresh token
                );

                if (res.data?.accessToken) {
                    dispatch(
                        setCredentials({ 
                            accessToken: res.data.accessToken, 
                            user: res.data.user 
                        })
                    );
                }
            } catch (error) {
                console.warn("Session expired or refresh failed:", error);
                dispatch(clearCredentials());
                clearInterval(refreshTimer.current);
            }
        }, REFRESH_INTERVAL);

        return () => clearInterval(refreshTimer.current)
    }, [isAuthenticated, dispatch]);


    // listen for login/logout events from other tabs
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'logout') {
                dispatch(clearCredentials());
            } else if (event.key === 'login') {
                // refresh page to trigger restore session
                window.location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };  
    }, [dispatch]);


    // check auth satus
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // define auth reusable auth actions
    const actions = {
        loginUser: (formData) => dispatch(loginUser(formData)),
        registerUser: (formData) => dispatch(registerUser(formData)),
        logoutUser: () => dispatch(logoutUser()),
        refreshSession: () => dispatch(refreshSession()),
        checkAuth: () => dispatch(checkAuth()),
        setUser: () => dispatch(setUser()),
        setCredentials: (data) => dispatch(setCredentials(data)),
        clearCredentials: () => dispatch(clearCredentials()),
        setAuthError: (error) => dispatch(setAuthError(error)),
        clearMessages: () => dispatch(clearMessages()),
    };
    
    //prevent premature loading
    if (authState.isAuthenticated && !authState.user) {
        return (
            <Skeleton className="w-full h-full bg-black" />
        )
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, actions}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;