import mongoose from "mongoose";
import { IAdmin } from "../../all-types/all-interface";

const adminSchema = new mongoose.Schema<IAdmin>({
	userName: String,
	password: String,
	image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "media",
	},
	phoneNumber: Number,
});

export const Admin = mongoose.model("Admin", adminSchema);
