import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getMessages } from '../controllers/messages.controller.js';

const router = Router();

router.use(protect);

router.get('/:matchId', getMessages);

export default router;