"use strict";

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;


//routers
const authRouter = require('./routes/auth-route');

// Connect to MongoDB
connectDB(MONGODB_URL);

const app = express();

const allowedOrigins = [
    'https://duka-ecommerce-app.vercel.app',
    'http://localhost:5173'
];
// Middleware (comes fast before routes)
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // for login
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Pragma',
        'Expires'
        ],
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());


// use routes
app.use("/api/auth/", authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});