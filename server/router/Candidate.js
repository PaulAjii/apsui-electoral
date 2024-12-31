import { Router } from 'express';

import {
	getAllCandidates,
	createCandidate,
	getSingleCandidate,
	deleteCandidate
} from '../controllers/Candidate.js';

const router = Router();

router.route('/candidates').get(getAllCandidates).post(createCandidate);
router.route('/candidates/:id').get(getSingleCandidate).delete(deleteCandidate);

export default router;
