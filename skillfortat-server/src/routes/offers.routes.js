import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createOffer,
  getOffers,
  updateOffer,
  deleteOffer,
  getMyOffers,
} from '../controllers/offers.controller.js';
import { body } from 'express-validator';

const router = Router();

router.use(protect);

router.get('/',     getOffers);
router.get('/mine', getMyOffers);

router.post(
  '/',
  [
    body('teaches').trim().notEmpty().withMessage('teaches is required'),
    body('wants').trim().notEmpty().withMessage('wants is required'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
  ],
  createOffer
);

router.patch('/:id', updateOffer);
router.delete('/:id', deleteOffer);

export default router;