"use strict"

import { 
    attemptRefresh, clearCredentials, loginUser,
    logoutUser, registerUser, setAuthError, 
    setCredentials, setUser, clearMessages
    } from '@/store/authSlice';

import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from './authContext';



// provider to wrap on app
export function  AuthProvider({ children }) {
    
    const dispatch = useDispatch();
    
    // get auth state from redux
    const authState = useSelector((state) => state.auth);

    // extract specific values for convinienc
    const isAuthenticated = authState.isAuthenticated;
    const user = authState.user;
    const isLoading = authState.isLoading;
    const error = authState.error;

    // define auth actions
    const actions = {
        loginUser: (formData) => dispatch(loginUser(formData)),
        registerUser: (formData) => dispatch(registerUser(formData)),
        logoutUser: () => dispatch(logoutUser()),
        attemptRefresh: () => dispatch(attemptRefresh()),
        setUser: () => dispatch(setUser()),
        setCredentials: () => dispatch(setCredentials()),
        clearCredentials: () => dispatch(clearCredentials()),
        setAuthError: () => dispatch(setAuthError()),
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