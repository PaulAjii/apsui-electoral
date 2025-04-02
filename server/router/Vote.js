import { Router } from 'express';
import { castVote, getResults } from '../controllers/Vote.js';
import { isVoter } from '../middlewares/isVoter.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

router.post('/cast', authenticateUser, isVoter, castVote);
router.route('/results').get(getResults);

export default router;
