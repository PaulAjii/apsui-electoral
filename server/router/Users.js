import { Router } from 'express';

import { createUser, getUsers } from '../controllers/Users.js';

const router = Router();

router.route('/users').post(createUser).get(getUsers);

export default router;
