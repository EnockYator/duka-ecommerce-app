
"use strict"

const { mongoose } = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    device: { type: String }, //e.g., 'iPhone', 'Chrome on Windows'
    ip: { type: String }, // IP address from which the token was issued
    issuedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    role: { type: String, default: 'customer',}, // customer || admin
    refreshTokens: [refreshTokenSchema],
});


module.exports = UserSchema;