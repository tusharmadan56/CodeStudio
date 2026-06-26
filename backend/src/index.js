import express from 'express';
import cors from 'cors';

import { PORT } from './config/serverConfig.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

app.use('/api/v1/projects', projectRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
