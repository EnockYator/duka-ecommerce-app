"use strict"

const express = require('express');
const { registerUser, loginUser, refreshAccessToken, logoutUser } = require('../services/auth-service');

// create router interface
const router = express.Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken); // uses cookie
router.post("/logout", logoutUser);

module.exports = router;