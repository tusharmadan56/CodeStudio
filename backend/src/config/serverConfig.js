import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const PROJECTS_DIR = process.env.PROJECTS_DIR || './projects';

export const SCAFFOLD_CMD =
    process.env.SCAFFOLD_CMD || 'npm create vite@latest {{projectName}} -- --template react';

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
export const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

export const PREVIEW_HOST = process.env.PREVIEW_HOST || 'localhost';

export const SANDBOX_MEMORY_MB = Number(process.env.SANDBOX_MEMORY_MB) || 512;
export const SANDBOX_CPUS = Number(process.env.SANDBOX_CPUS) || 1;
export const SANDBOX_PIDS_LIMIT = Number(process.env.SANDBOX_PIDS_LIMIT) || 256;
