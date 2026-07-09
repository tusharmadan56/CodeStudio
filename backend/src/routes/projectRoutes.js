import express from 'express';

import { createProject, getProjectTree } from '../controllers/projectController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createProject);
router.get('/:projectId', getProjectTree);

export default router;
