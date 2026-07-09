import express from 'express';

import { createProject, listProjects, getProjectTree } from '../controllers/projectController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireProjectAccess } from '../middlewares/projectAccessMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createProject);
router.get('/', requireAuth, listProjects);
router.get('/:projectId', requireAuth, requireProjectAccess, getProjectTree);

export default router;
