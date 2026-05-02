import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getMatches, acceptMatch, declineMatch } from '../controllers/matches.controller.js';

const router = Router();

router.use(protect);

router.get('/',              getMatches);
router.post('/:id/accept',  acceptMatch);
router.post('/:id/decline', declineMatch);

export default router;