import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const PROJECTS_DIR = process.env.PROJECTS_DIR || './projects';

export const SCAFFOLD_CMD =
    process.env.SCAFFOLD_CMD || 'npm create vite@latest {{projectName}} -- --template react';
