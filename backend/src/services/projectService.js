import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';
import directoryTree from 'directory-tree';

import { execPromisified } from '../utils/execUtil.js';
import { PROJECTS_DIR, SCAFFOLD_CMD } from '../config/serverConfig.js';

const SAFE_PROJECT_ID = /^[a-zA-Z0-9-]+$/;

export const createProjectService = async () => {
    const projectId = uuid4();
    const projectPath = path.join(PROJECTS_DIR, projectId);

    await fs.mkdir(projectPath, { recursive: true });

    const command = SCAFFOLD_CMD.replace('{{projectName}}', projectId);
    await execPromisified(command, { cwd: projectPath });

    return projectId;
};

export const getProjectTreeService = async (projectId) => {
    if (!SAFE_PROJECT_ID.test(projectId)) {
        return null;
    }

    const projectPath = path.join(PROJECTS_DIR, projectId);
    if (!existsSync(projectPath)) {
        return null;
    }

    return directoryTree(projectPath);
};
