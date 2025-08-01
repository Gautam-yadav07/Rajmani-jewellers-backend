import { IGoldPrice } from "../../all-types/all-interface";
import mongoose from "mongoose";

const goldPriceSchema = new mongoose.Schema<IGoldPrice>({
	price18k: { type: String },
	price20k: { type: String },
	price22k: { type: String },
	price24k: { type: String },
	date: { type: Date, required: true },
});

export const GoldPrice = mongoose.model("goldPrice", goldPriceSchema);
