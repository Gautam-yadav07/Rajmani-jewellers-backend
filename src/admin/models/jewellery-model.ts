import { IJewellery } from "../../all-types/all-interface";
import mongoose from "mongoose";

const jewellerySchema = new mongoose.Schema<IJewellery>({
	image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "media",
	},
	description: { type: String },
	grossWeight: { type: String },
	netWeight: { type: String },
	price: { type: String },
	stockStatus: {
		type: String,
		enum: ["inStock", "comingSoon"],
		required: true,
	},
});

export const Jewellery = mongoose.model("jewellery", jewellerySchema);
