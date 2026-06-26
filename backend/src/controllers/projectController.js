import { createProjectService } from '../services/projectService.js';

export const createProject = async (req, res) => {
    try {
        const projectId = await createProjectService();

        return res.status(201).json({
            message: 'Project created successfully',
            data: projectId,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create project',
            error: error.message,
        });
    }
};
