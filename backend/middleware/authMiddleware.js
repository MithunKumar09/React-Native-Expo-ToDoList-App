//backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.error('❌ Authorization header missing');
      return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
    if (!token) {
      console.error('❌ Token missing in Authorization header');
      return res.status(401).json({ message: 'Access denied: Token missing' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing from environment variables');
      return res.status(500).json({ message: 'Server error: Missing JWT_SECRET' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('✅ Token verified successfully:', verified);

    next();
  } catch (error) {
    console.error('❌ Invalid token:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
