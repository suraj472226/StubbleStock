import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types/requestTypes';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, env.JWT_SECRET);

      // Attach user info to request object
      req.user = { 
        id: decoded.id, 
        role: decoded.role 
      };

      // CRITICAL: Call next() and then RETURN to stop execution here
      return next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 2. If no token was found at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};