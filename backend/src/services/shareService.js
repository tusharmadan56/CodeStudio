import crypto from 'crypto';

import { prisma } from '../config/prismaClient.js';

export const getOrCreateShareLink = async (projectId, userId) => {
    const existing = await prisma.projectShare.findFirst({ where: { projectId } });
    if (existing) return existing.token;

    const share = await prisma.projectShare.create({
        data: {
            token: crypto.randomBytes(24).toString('base64url'),
            projectId,
            createdBy: userId,
        },
    });
    return share.token;
};

export const revokeShareLinks = async (projectId) => {
    await prisma.projectShare.deleteMany({ where: { projectId } });
};

export const joinByShareToken = async (token, userId) => {
    const share = await prisma.projectShare.findUnique({
        where: { token },
        include: { project: { select: { ownerId: true } } },
    });
    if (!share) return null;

    if (share.project.ownerId !== userId) {
        await prisma.projectMember.upsert({
            where: { projectId_userId: { projectId: share.projectId, userId } },
            update: {},
            create: { projectId: share.projectId, userId },
        });
    }
    return share.projectId;
};
