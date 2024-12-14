import { Router } from 'express';

import {
	getAllCandidates,
	createCandidate,
	getSingleCandidate,
} from '../controllers/Candidate.js';

const router = Router();

router.route('/candidates').get(getAllCandidates).post(createCandidate);
router.route('/candidates/:id').get(getSingleCandidate);

export default router;
