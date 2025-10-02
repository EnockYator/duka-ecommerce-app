"use strict"

const mongoose = require('mongoose');

const connectDB = async (DB_URL) => {
    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        throw new Error (`Failed to connect to MongoDB : ${error.message}`);
    }
};

module.exports = connectDB;