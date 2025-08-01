import {
	createGoldPrice,
	deleteJewelleryByDate,
	deleteJewelleryById,
	getAllGoldPrices,
	getParticularGoldPriceByDate,
	getParticularGoldPriceById,
	updateParticularGoldPriceByDate,
	updateParticularGoldPriceById,
} from "../controllers/gold-price-controller";
import { Router } from "express";

const router = Router();

router.post("/create-gold-price-record", createGoldPrice);
router.get("/get-all-gold-price-records", getAllGoldPrices);
router.get(
	"/get-gold-price-record-by-date/:date",
	getParticularGoldPriceByDate
);
router.get("/get-gold-price-record-by-id/:id", getParticularGoldPriceById);
router.put(
	"/update-gold-price-record-by-id/:id",
	updateParticularGoldPriceById
);
router.put(
	"/update-gold-price-record-by-date/:date",
	updateParticularGoldPriceByDate
);
router.delete("/delete-gold-price-record-by-date/:date", deleteJewelleryByDate);
router.delete("/delete-gold-price-record-by-id/:id", deleteJewelleryById);

export default router;
