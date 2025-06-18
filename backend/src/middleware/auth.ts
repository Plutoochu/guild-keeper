import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tip: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Pristup odbačen, token nije pronađen'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Token nije valjan'
      });
      return;
    }

    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      tip: user.tip
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token nije valjan'
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.tip !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Pristup dozvoljen samo administratorima'
    });
    return;
  }
  next();
}; 