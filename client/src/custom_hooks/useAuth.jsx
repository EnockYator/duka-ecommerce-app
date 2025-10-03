"use strict"

import { useContext } from "react"
import { AuthContext } from "@/contexts/auth/authContext"

export function useAuth() {
    
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProviver');
    }

    return context;
};

