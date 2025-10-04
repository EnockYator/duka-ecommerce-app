"use strict"

// login validation helper
export function validateLoginInput({ email, password }) {
    const errors = {};

    // Email
    if (!email || email.trim() === "") {
        errors.email = "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.email = "Email format is invalid";
    }

    // Password
    if (!password || password.trim() === "") {
        errors.password = "Password is required";
    } 
    if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    }
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(password)) {
    errors.password =
        "Password must include at least one uppercase letter, one number, and one special character";
    }
    
    return errors;
};
