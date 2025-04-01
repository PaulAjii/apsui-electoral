import { Router } from 'express';
import { upload } from '../middlewares/multerUpload.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { authenticateUser } from '../middlewares/auth.js';

import {
	getAllCandidates,
	createCandidate,
	getSingleCandidate,
	deleteCandidate,
	updateCandidate,
} from '../controllers/Candidate.js';

const router = Router();

router.get('/candidates', getSingleCandidate);
router.get('/candidates/:id', authenticateUser, getAllCandidates);
router.post('/candidates', authenticateUser, isAdmin, createCandidate);
router.delete('/candidates/:id', authenticateUser, isAdmin, deleteCandidate);
router.patch(
	'/candidates/:id',
	authenticateUser,
	isAdmin,
	upload.single('image'),
	updateCandidate
);

export default router;
