import express from 'express';

import { createProject, listProjects, getProjectTree } from '../controllers/projectController.js';
import { createShareLink, revokeShareLink } from '../controllers/shareController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requireProjectAccess } from '../middlewares/projectAccessMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createProject);
router.get('/', requireAuth, listProjects);
router.get('/:projectId', requireAuth, requireProjectAccess, getProjectTree);
router.post('/:projectId/share', requireAuth, requireProjectAccess, createShareLink);
router.delete('/:projectId/share', requireAuth, requireProjectAccess, revokeShareLink);

export default router;
