import { resolveProjectAccess } from '../services/projectAccessService.js';


export const requireProjectAccess = async (req, res, next) => {
    try {
        const role = await resolveProjectAccess(req.user.id, req.params.projectId);
        if (!role) {
            return res.status(403).json({ message: 'You do not have access to this project' });
        }
        req.projectRole = role;
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authorize project access', error: error.message });
    }
};
