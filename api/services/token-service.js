"use strict";

const jwt = require('jsonwebtoken');
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Function to generate access token
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { 
        expiresIn: '15m' 
    });
};  

// Function to generate refresh token (keep the token minimal for security) 
const generateRefreshToken = ({ userID }) => {
    return jwt.sign({ userID }, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    }
    );
};

// Function to verify access token
const verifyAccessToken = (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return { 
            valid: true,
            expired: false,
            decoded
        };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return {
                valid: false,
                expired: true,
                decoded: null
            };
        }
        return {
            valid: false,
            expired: false,
            decoded: null 
        }; 
    }
};

// Function to verify refresh token
const verifyRefreshToken = (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return {
            valid: true,
            expired: false,
            decoded
        };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return {
                valid: false,
                expired: true,
                decoded: null
            };
        }
        return {
            valid: false,
            expired: false,
            decoded: null
        };
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};