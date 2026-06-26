import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

import { execPromisified } from '../utils/execUtil.js';
import { PROJECTS_DIR, SCAFFOLD_CMD } from '../config/serverConfig.js';

export const createProjectService = async () => {
    const projectId = uuid4();
    const projectPath = path.join(PROJECTS_DIR, projectId);

    await fs.mkdir(projectPath, { recursive: true });

    const command = SCAFFOLD_CMD.replace('{{projectName}}', projectId);
    await execPromisified(command, { cwd: projectPath });

    return projectId;
};
