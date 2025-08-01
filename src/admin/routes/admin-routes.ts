import express from "express";
import { addOrLoginAdmin, adminLogout } from "../controllers/admin-controller";
import { auth } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";
import { upload } from "../../middlewares/multer-config";
const router = express.Router();

router.post("/create-or-login-admin", upload.single("image"), addOrLoginAdmin);
router.get("/logout-admin", auth, isAdmin, adminLogout);

export default router;
