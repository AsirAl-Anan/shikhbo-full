import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
export const protectedRoute = async (req, res, next) => {
  try {
   console.log("Protected route middleware called");
    // Get token from cookies
    const token = req.cookies.accessToken;
  console.log("Access token from cookies:", token);
    if (!token) {
      console.log("No access token found in cookies");
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
 
    if(!token && req.cookies.refreshToken) {
      console.log("No access token, checking refresh token");
      const refreshToken = req.cookies.refreshToken;
     
      const decoded =await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      const newAccessToken = generateAccessToken(user);
    }

    // Verify token
    const decoded =await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log(decoded);
    console.log("Decoded token:", "askjjjsdjb");

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

