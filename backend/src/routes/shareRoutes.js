import express from 'express';

import { joinProject } from '../controllers/shareController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:token/join', requireAuth, joinProject);

export default router;
