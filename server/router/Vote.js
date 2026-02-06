import { Router } from 'express';
import { castVote, getResults } from '../controllers/Vote.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

router.post('/cast', castVote);
router.get('/results', isAdmin, getResults);

export default router;
