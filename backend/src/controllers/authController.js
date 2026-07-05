import { registerUser, authenticateUser, getUserById } from '../services/authService.js';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../utils/tokenUtil.js';

const REFRESH_COOKIE = 'refreshToken';

// path scopes the cookie to the auth routes, so it isn't sent on every API call — only where it's needed.
const refreshCookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const issueRefreshCookie = (res, userId) =>
    res.cookie(REFRESH_COOKIE, signRefreshToken(userId), refreshCookieOptions);

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const user = await registerUser({ email, password, name });
        issueRefreshCookie(res, user.id);
        return res.status(201).json({ data: { user, accessToken: signAccessToken(user.id) } });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await authenticateUser({ email, password });
        issueRefreshCookie(res, user.id);
        return res.status(200).json({ data: { user, accessToken: signAccessToken(user.id) } });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

export const refresh = (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    try {
        const { sub } = verifyRefreshToken(token);
        issueRefreshCookie(res, sub); // rotate: a used refresh token is replaced with a fresh one
        return res.status(200).json({ data: { accessToken: signAccessToken(sub) } });
    } catch {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

export const logout = (req, res) => {
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
    return res.status(200).json({ message: 'Logged out' });
};

export const me = async (req, res) => {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ data: { user } });
};
