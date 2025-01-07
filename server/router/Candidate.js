import { Router } from 'express';
import { upload } from '../middlewares/multerUpload.js';

import {
	getAllCandidates,
	createCandidate,
	getSingleCandidate,
	deleteCandidate,
	updateCandidate,
} from '../controllers/Candidate.js';

const router = Router();

router.route('/candidates').get(getAllCandidates).post(createCandidate);
router.route('/candidates/:id').get(getSingleCandidate).delete(deleteCandidate);
router.patch('/candidates/:id', upload.single('image'), updateCandidate);

export default router;
