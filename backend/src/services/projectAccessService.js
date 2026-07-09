import { prisma } from '../config/prismaClient.js';


export const resolveProjectAccess = async (userId, projectId) => {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
    });
    if (!project) return null;
    if (project.ownerId === userId) return 'owner';

    const membership = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
        select: { id: true },
    });
    return membership ? 'member' : null;
};
