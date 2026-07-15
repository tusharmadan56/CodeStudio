import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chokidar from 'chokidar';

import { PORT, PROJECTS_DIR, CLIENT_ORIGIN } from './config/serverConfig.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import { handleContainerCreate, cleanupSandboxContainers } from './containers/handleContainerCreate.js';
import { requireSocketProjectAccess } from './middlewares/socketAuthMiddleware.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: { origin: CLIENT_ORIGIN },
});


app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true })); // credentials: allow the refresh-token cookie cross-origin
app.use(cookieParser());

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/shares', shareRoutes);

const editorNamespace = io.of('/editor');
editorNamespace.use(requireSocketProjectAccess);
editorNamespace.on('connection', (socket) => {
    console.log('Editor socket connected', socket.id);

    const projectId = socket.handshake.query.projectId;
    let watcher;

    if (projectId) {
        watcher = chokidar.watch(path.join(PROJECTS_DIR, projectId), {
            ignored: (filePath) => filePath.includes('node_modules'),
            persistent: true,
            awaitWriteFinish: { stabilityThreshold: 2000 },
            ignoreInitial: true,
        });

        watcher.on('all', (event, filePath) => {
            console.log('File event:', event, filePath);
        });
    }

    handleEditorSocketEvents(socket);

    socket.on('disconnect', async () => {
        console.log('Editor socket disconnected', socket.id);
        if (watcher) {
            await watcher.close();
        }
    });
});

const terminalNamespace = io.of('/terminal');
terminalNamespace.use(requireSocketProjectAccess);
terminalNamespace.on('connection', async (socket) => {
    console.log('Terminal socket connected', socket.id);

    const projectId = socket.handshake.query.projectId;
    let container;
    let disconnected = false;

    const removeContainer = async () => {
        if (!container) return;
        try {
            await container.remove({ force: true });
        } catch (error) {
            console.log('Error removing the container', error);
        }
        container = undefined;
    };

    // Register cleanup first so a disconnect during container startup isn't missed
    
    socket.on('disconnect', async () => {
        console.log('Terminal socket disconnected', socket.id);
        disconnected = true;
        await removeContainer();
    });

    try {
        container = await handleContainerCreate(projectId, socket);
        if (disconnected) await removeContainer(); // socket already left while starting up
    } catch (error) {
        console.log('Error creating the container', error);
    }
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await cleanupSandboxContainers();
});
