"use strict"

import authReducer from './authSlice'
import { configureStore } from '@reduxjs/toolkit';
import { injectstore } from './../../axios';

const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});

// inject the store into axios after creation to avoid circular dependency
injectstore(store);

export default store;
