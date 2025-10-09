"use strict"

const { verifyAccessToken } = require("./../services/token-service");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No access token" });
  }

  const token = authHeader.split(" ")[1];
  const { valid, expired, decoded } = verifyAccessToken(token);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: expired ? "Token expired" : "Invalid token"
    });
  }

  // Attach decoded user to req
  req.user = decoded;
  next();
};

module.exports = authMiddleware;
