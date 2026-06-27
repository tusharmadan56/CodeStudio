import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chokidar from 'chokidar';

import { PORT, PROJECTS_DIR } from './config/serverConfig.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: { origin: '*' },
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

app.use('/api/v1/projects', projectRoutes);

const editorNamespace = io.of('/editor');
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

    socket.on('disconnect', async () => {
        console.log('Editor socket disconnected', socket.id);
        if (watcher) {
            await watcher.close();
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
