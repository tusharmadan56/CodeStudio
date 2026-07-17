import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';
import directoryTree from 'directory-tree';

import { execPromisified } from '../utils/execUtil.js';
import { PROJECTS_DIR, SCAFFOLD_CMD, PREVIEW_HMR_CLIENT_PORT } from '../config/serverConfig.js';
import { prisma } from '../config/prismaClient.js';

const SAFE_PROJECT_ID = /^[a-zA-Z0-9-]+$/;

// behind the https preview proxy, the HMR websocket must target the proxy port over wss
const HMR_CONFIG = PREVIEW_HMR_CLIENT_PORT
    ? `\n        hmr: { clientPort: ${Number(PREVIEW_HMR_CLIENT_PORT)}, protocol: 'wss' },`
    : '';

// host:true → dev server binds 0.0.0.0 (reachable through the container port mapping)
// strictPort+port → stays on 5173, the port we map for preview
// usePolling → detect host edits across the Docker bind mount (HMR)
const VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        strictPort: true,${HMR_CONFIG}
        watch: { usePolling: true },
    },
});
`;

export const createProjectService = async (ownerId, name) => {
    const projectId = uuid4();
    const projectPath = path.join(PROJECTS_DIR, projectId);

    await fs.mkdir(projectPath, { recursive: true });

    const command = SCAFFOLD_CMD.replace('{{projectName}}', projectId);
    await execPromisified(command, { cwd: projectPath });

    // overwrite the scaffolded config so the dev server is reachable + hot-reloads in the container
    await fs.writeFile(path.join(projectPath, projectId, 'vite.config.js'), VITE_CONFIG);

    // row written only after the folder scaffolds, so a Project always maps to a real folder on disk
    await prisma.project.create({ data: { id: projectId, name, ownerId } });

    return projectId;
};

export const listProjectsService = async (userId) => {
    const projects = await prisma.project.findMany({
        where: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true, name: true, ownerId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });

    return projects.map(({ ownerId, ...project }) => ({
        ...project,
        role: ownerId === userId ? 'owner' : 'member',
    }));
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
