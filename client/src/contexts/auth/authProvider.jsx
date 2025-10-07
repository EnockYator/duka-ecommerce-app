"use strict"

import { 
    refreshSession, clearCredentials, loginUser,
    logoutUser, registerUser, setAuthError, 
    setCredentials, setUser, clearMessages
} from '@/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AuthContext } from './authContext';

// provider to wrap on app
export function  AuthProvider({ children }) {
    const dispatch = useDispatch();
    
    // get auth state from redux
    const authState = useSelector((state) => state.auth);

    // extract specific values for convinience
    const { user, isAuthenticated, isLoading, error } = authState;

    // run refreshSession when app mounts (on reload or on first visit)
    useEffect(() => {
        const refreshOnMount = async () => {
            try {
                const res = await dispatch(refreshSession()).unwrap(); // using uwrap allow catching errors easily
                if (res?.message?.includes("guest mode")) {
                    dispatch(clearCredentials());
                }
            } catch (err) {
                // Ignore “token not provided” or “guest mode” errors
                dispatch(clearCredentials());
            }
        };
        refreshOnMount();
        
        // also refresh after every 15 minutes (900,000 ms)
        const interval = setInterval(() => {
            refreshOnMount();
        }, 15 * 60 * 1000); // 15 minutes

        return () => clearInterval(interval); // cleanup up interval on unmount

    }, [dispatch]);

    // show loading screen while refreshing
    if (isLoading && !user) {
        return (
            <div className='w-screen h-screen bg-gray-50 px-4 py-4'>Loading session...</div>
        );
    }

    // define auth reusable auth actions
    const actions = {
        loginUser: (formData) => dispatch(loginUser(formData)),
        registerUser: (formData) => dispatch(registerUser(formData)),
        logoutUser: () => dispatch(logoutUser()),
        refreshSession: () => dispatch(refreshSession()),
        setUser: () => dispatch(setUser()),
        setCredentials: (data) => dispatch(setCredentials(data)),
        clearCredentials: () => dispatch(clearCredentials()),
        setAuthError: (error) => dispatch(setAuthError(error)),
        clearMessages: () => dispatch(clearMessages()),
    };
    
    // prevent premature loading
    if (authState.isAuthenticated && !authState.user) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, actions}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;