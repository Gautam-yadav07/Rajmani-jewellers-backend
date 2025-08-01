import {
	getJewellery,
	getAllJewellery,
	deleteJewelleryById,
	createJewellery,
	updateJewellery,
} from "../controllers/jewellery-controller";
import { Router } from "express";
import { upload } from "../../middlewares/multer-config";

const router = Router();

router.get("/get-all-jewellery-records", getAllJewellery);
router.get("/get-jewellery-record-by-id/:id", getJewellery);
router.post(
	"/create-jewellery-record",
	upload.single("image"),
	createJewellery
);
router.put(
	"/update-jewellery-record-by-id/:id",
	upload.single("image"),
	updateJewellery
);
router.delete("/delete-jewellery-record-by-id/:id", deleteJewelleryById);

export default router;
