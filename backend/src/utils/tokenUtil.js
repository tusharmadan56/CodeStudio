import jwt from 'jsonwebtoken';

import {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
} from '../config/serverConfig.js';

export const signAccessToken = (userId) =>
    jwt.sign({ sub: userId }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

export const signRefreshToken = (userId) =>
    jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

export const verifyAccessToken = (token) => jwt.verify(token, JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, JWT_REFRESH_SECRET);
