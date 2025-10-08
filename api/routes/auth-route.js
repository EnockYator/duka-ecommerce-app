"use strict"

const express = require('express');
const { registerUser, loginUser, refreshRefreshToken, logoutUser } = require('../services/auth-service');

// create router interface
const router = express.Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshRefreshToken); // uses cookie
router.post("/logout", logoutUser);

module.exports = router;