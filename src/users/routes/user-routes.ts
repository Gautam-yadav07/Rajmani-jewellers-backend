import express from "express"
import { addUser, login } from "../controllers/user-controller";
import { auth } from "../../middlewares/auth";
const router = express.Router()

router.post("/", addUser);
router.post("/login", login);

export default router