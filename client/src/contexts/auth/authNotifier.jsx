"use strict"

import { clearMessages } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner";


export function AuthNotifier() {
    const dispatch = useDispatch();
    const { message, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (message) {
            toast.success(message);  // success toast
            dispatch(clearMessages());  // clear message after showing
        }

        if (error) {
            toast.error(error); // error toast
            dispatch(clearMessages());
        }
    }, [message, error, dispatch]);

    return null // this component only listens
};