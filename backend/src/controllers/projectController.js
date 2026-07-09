import {
    createProjectService,
    listProjectsService,
    getProjectTreeService,
} from '../services/projectService.js';

export const createProject = async (req, res) => {
    try {
        const name = req.body?.name?.trim() || 'Untitled Project';
        const projectId = await createProjectService(req.user.id, name);

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

export const listProjects = async (req, res) => {
    try {
        const projects = await listProjectsService(req.user.id);

        return res.status(200).json({
            message: 'Projects fetched successfully',
            data: projects,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch projects',
            error: error.message,
        });
    }
};

export const getProjectTree = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tree = await getProjectTreeService(projectId);

        if (!tree) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json({
            message: 'Project tree fetched successfully',
            data: tree,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch project tree',
            error: error.message,
        });
    }
};
