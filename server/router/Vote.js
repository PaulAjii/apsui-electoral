import { Router } from 'express';
import { castVote, getResults } from '../controllers/Vote.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

router.post('/cast', authenticateUser, isAdmin, castVote);
router.route('/results').get(getResults);

export default router;
