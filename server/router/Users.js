import { Router } from 'express';

import {
	createUser,
	getUsers,
	getUser,
	updateUser,
} from '../controllers/Users.js';

const router = Router();

router.route('/users').post(createUser).get(getUsers);
router.route('/users/:id').get(getUser).patch(updateUser);

export default router;
