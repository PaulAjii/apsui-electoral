import { Router } from 'express';
import { castVote, getResults } from '../controllers/Vote.js';

const router = Router();

router.route('/vote').post(castVote).get(getResults);

export default router;
