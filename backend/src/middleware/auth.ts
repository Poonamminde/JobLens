import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import type { IUser } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.cookies?.jwt) {
    token = req.cookies.jwt as string;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
    return;
  }

  try {
    const secret = process.env['JWT_SECRET'];
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
