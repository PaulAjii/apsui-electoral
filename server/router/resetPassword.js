import { Router } from 'express';
import { resetPassword } from '../controllers/resetPassword.js';

const router = Router();

router.route('/password-reset').post(resetPassword);

export default router;
