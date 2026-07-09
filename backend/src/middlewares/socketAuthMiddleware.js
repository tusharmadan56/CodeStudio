import { verifyAccessToken } from '../utils/tokenUtil.js';
import { resolveProjectAccess } from '../services/projectAccessService.js';


export const requireSocketProjectAccess = async (socket, next) => {
    let userId;
    try {
        userId = verifyAccessToken(socket.handshake.auth?.token).sub;
    } catch {
        return next(new Error('Authentication required'));
    }

    try {
        const projectId = socket.handshake.query?.projectId;
        const role = projectId ? await resolveProjectAccess(userId, projectId) : null;
        if (!role) {
            return next(new Error('You do not have access to this project'));
        }
        socket.data.userId = userId;
        socket.data.projectRole = role;
        return next();
    } catch {
        return next(new Error('Failed to authorize project access'));
    }
};
