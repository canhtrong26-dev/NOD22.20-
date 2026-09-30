import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import RefreshToken from '../models/refreshToken';


const createRefreshToken = async (userId: number) => {
    const token = jwt.sign(
        { id: userId },
        authConfig.refreshSecret as string,
        { expiresIn: '7d' }
    );

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({
        token: token,
        userId: userId,
        expiryDate: expiryDate,
    });

    return token;
};



export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ username, email, password: hashedPassword });
        return res.status(201).json({ message: 'User registered successfully!', user });
    } catch (err) {
        return res.status(500).json({ error: 'Error registering user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            { id: user.id },
            authConfig.secret as string,
            { expiresIn: '15m' }
        );

        const refreshToken = await createRefreshToken(user.id);

        return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        return res.status(500).json({ error: 'Error logging in' });
    }
};


export const refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh Token is required!' });
    }

    try {
        const existingToken = await RefreshToken.findOne({
            where: { token: refreshToken }
        });

        if (!existingToken) {
            return res.status(403).json({ message: 'Refresh token not found' });
        }

        if (existingToken.expiryDate < new Date()) {
            return res.status(403).json({ message: 'Refresh token expired. Please login again.' });
        }

        const decoded = jwt.verify(refreshToken, authConfig.refreshSecret as string) as { id: number };

        const accessToken = jwt.sign(
            { id: decoded.id },
            authConfig.secret as string,
            { expiresIn: '15m' }
        );

        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(500).json({ message: 'Could not refresh token' });
    }
};


export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        await RefreshToken.destroy({
            where: { token: refreshToken }
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error logging out' });
    }
};