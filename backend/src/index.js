import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { PORT } from './config/serverConfig.js';
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

    socket.on('disconnect', () => {
        console.log('Editor socket disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
