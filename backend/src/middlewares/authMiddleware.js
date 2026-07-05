import { verifyAccessToken } from '../utils/tokenUtil.js';

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = { id: payload.sub };
        return next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
