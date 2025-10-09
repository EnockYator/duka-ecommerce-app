"use strict"

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const { generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken, 
} = require('./token-service');

// input validators
const { validateRegisterInput } = require('../utils/auth-validators/registerValidator');
const { validateLoginInput } = require('../utils/auth-validators/loginValidator');


/********* register service *********/

const registerUser = async (req, res) => {
    const {userName, email, password} = req.body;

    try {
        // run validation
        const errors = validateRegisterInput({ userName, email, password });
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                errors
            })
        }

        // check if the user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user already registered with this email"
            });
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 12);
        
        // save user
        const newUser = new User({
            userName,
            email,
            password : hashPassword
        });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:  error.message || "Server error. Please try again later.", 
        });
    }
};


/********* login service *********/

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // run validation
        const errors = validateLoginInput({ email, password });
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                errors
            })
        }

        // check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "No user found with this email" 
            });
        }
        
        // compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // create JWT payload
        const payload = {
            id: existingUser._id.toString(),
            userName: existingUser.userName,
            email: existingUser.email,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken({ userID: payload.id });

        // get device info (user-agent) & IP address
        const device = req.headers['user-agent'] || 'unknown device';
        const ip  = req.ip || req.connection?.remoteAddress || 'unknown IP address';

        // replace old refresh token with new one in DB
        existingUser.refreshTokens = existingUser.refreshTokens.filter(rt => rt.token !== refreshToken);
        
        // add new refresh token object
        existingUser.refreshTokens.push({
            token: refreshToken,
            device,
            ip,
        });

        // keep only last 5 tokens
        if (existingUser.refreshTokens.length > 5) {
            existingUser.refreshTokens = existingUser.refreshTokens.slice(-5);
        }        

        await existingUser.save();

        // set HttpOnly cookie (secure === true in production) 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // safe user object for frontend ui
        const safeUser = {
            id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
            role: existingUser.role,
        };

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser,  // return only non-sensitive user data
            accessToken, // short-lived for Authorization header
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error. Please try again later.",
        });
    }
};

/********* refreshToken service *********/
const refreshRefreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        
        // No token - guest mode (silently ignore)
        if (!token) {
            return res.status(200).json({
                success: false,
                mode: "guest",
                message: "No refresh token found, guest mode"
            });
        }
        
        // verify refresh token
        const { valid, expired, decoded } = verifyRefreshToken(token);
        
        // if invalid or expired - clear cookie + guest mode (no 401)
        if (!valid) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
                path: "/",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
             
            return res.status(200).json({
                success: false,
                mode: "guest",
                message: expired ? "Session expired, please login" : "Invalid refresh token"
            });
        }
       
        // find user and ensure token exists in DB
        const user = await User.findById(decoded.id);
        if (!user || !user.refreshTokens || !user.refreshTokens.some(t => t.token === token)) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
                path: "/",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });


            return res.status(200).json({
                success: false,
                mode: "guest",
                message: "Refresh token not recognized, guest mode"
            });
        }

        // Get token reference
        const storedToken = user.refreshTokens.find(t => t.token === token);
        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found for this device"
            });
        }

        // generate new tokens
        const payload = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email,
        };
        
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken({ userID: payload.id });
        
        // rotate this device's token
        storedToken.token = newRefreshToken;
        
        // limit number of token per user to 5
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        await user.save();

        // set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const safeUser = {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email,
            role: user.role,
        };

        return res.json({
            success: true,
            user: safeUser,
            accessToken: newAccessToken
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Session refresh failed"
        });
    }
};


/********* logout service *********/
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            // decode to extract user id
            const decoded = jwt.decode(token);

            if (decoded?.id) {
                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "User not found"
                    });
                }
                if (user) {
                    // remove only the token of this device from DB
                    user.refreshTokens = (user.refreshTokens || []).filter((t) => t.token !== token);
                    await user.save();
                }

            }
        }    

        // Clear the refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            }
        );

            
        return res.json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Logout failed"
        });
    }
};

/********* logout from all devices service *********/
const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id; // from access token middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json(
        {
            success: false,
            message: "User not found"
        });

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json(
        { 
            success: true,
            message: "Logged out from all devices"
        });

  } catch (err) {
    return res.status(500).json(
        { 
            success: false,
            message: err.message || "Failed to logout from all devices"
        });
  }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    logoutAllDevices,
    refreshRefreshToken
};