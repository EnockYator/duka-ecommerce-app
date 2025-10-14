"use strict"

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

// create router interface
const router = express.Router();

// protected routes
router.get("/dashboard", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the dashboard"
    });
});
router.get("/profile", authMiddleware, (req, res) => {
    const user = req.user; // from authMiddleware
    res.status(200).json({
        success: true,
        user,
        message: "This is your profile"
    });
});

 


module.exports = router;