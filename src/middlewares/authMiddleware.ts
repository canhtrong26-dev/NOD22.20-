import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, authConfig.secret as string) as { id: number };

        req.user = { id: decoded.id, role: '' };
        next();

       } catch (err: any) {

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', expired: true });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}