import bcrypt from 'bcryptjs';

import { prisma } from '../config/prismaClient.js';

const SALT_ROUNDS = 10;
const PUBLIC_FIELDS = { id: true, email: true, name: true, createdAt: true };

const httpError = (status, message) => Object.assign(new Error(message), { status });

export const registerUser = async ({ email, password, name }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw httpError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return prisma.user.create({ data: { email, passwordHash, name }, select: PUBLIC_FIELDS });
};

export const authenticateUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // Same error whether the email is unknown or the password is wrong .
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw httpError(401, 'Invalid email or password');
    }
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
};

export const getUserById = (id) => prisma.user.findUnique({ where: { id }, select: PUBLIC_FIELDS });
