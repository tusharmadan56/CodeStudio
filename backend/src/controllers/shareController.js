import {
    getOrCreateShareLink,
    revokeShareLinks,
    joinByShareToken,
} from '../services/shareService.js';

export const createShareLink = async (req, res) => {
    if (req.projectRole !== 'owner') {
        return res.status(403).json({ message: 'Only the owner can share a project' });
    }
    try {
        const token = await getOrCreateShareLink(req.params.projectId, req.user.id);

        return res.status(200).json({
            message: 'Share link ready',
            data: { token },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create share link',
            error: error.message,
        });
    }
};

export const revokeShareLink = async (req, res) => {
    if (req.projectRole !== 'owner') {
        return res.status(403).json({ message: 'Only the owner can revoke sharing' });
    }
    try {
        await revokeShareLinks(req.params.projectId);

        return res.status(200).json({ message: 'Share link revoked' });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to revoke share link',
            error: error.message,
        });
    }
};

export const joinProject = async (req, res) => {
    try {
        const projectId = await joinByShareToken(req.params.token, req.user.id);

        if (!projectId) {
            return res.status(404).json({ message: 'Invalid share link' });
        }

        return res.status(200).json({
            message: 'Joined project',
            data: { projectId },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to join project',
            error: error.message,
        });
    }
};
