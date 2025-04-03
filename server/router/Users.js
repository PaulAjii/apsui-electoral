import { Router } from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  findUserByMatric,
} from "../controllers/Users.js";

const router = Router();

router.route("/users").post(createUser).get(getUsers);
router.route("/users/role").get(findUserByMatric);
router.route("/users/:id").get(getUser).patch(updateUser);

export default router;
