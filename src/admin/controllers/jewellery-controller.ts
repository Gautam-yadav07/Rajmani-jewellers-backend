import { Request, Response } from "express";
import { Jewellery } from "../models/jewellery-model";
import { saveUploadedFile } from "../../media/utils/save-uploaded-file";
import { getUploadedFileById } from "../../media/utils/get-uploaded-file-by-id";
import { updateUploadedFileById } from "../../media/utils/update-by-id";
import mongoose from "mongoose";
import { deleteUploadedFileById } from "../../media/utils/delete-by-id";

// create jewellery
export const createJewellery = async (req: Request, res: Response) => {
	try {
		const { description, grossWeight, netWeight, price, stockStatus } =
			req.body;
		if (!req.file) {
			return res
				.status(400)
				.json({ success: true, message: "File is required", data: null });
		}
		const media = await saveUploadedFile(req.file);
		const jewellery = new Jewellery({
			image: media._id,
			description,
			grossWeight,
			netWeight,
			price,
			stockStatus,
		});
		await jewellery.save();
		res.status(201).json({
			success: true,
			message: "New jewellery entry has been created",
			data: jewellery,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// Get All Jewellery Data
export const getAllJewellery = async (req: Request, res: Response) => {
	try {
		const allJewellery = await Jewellery.find().populate(
			"image",
			"fileLocation"
		);
		res
			.status(200)
			.json({ message: "List of all jewellery record", data: allJewellery });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// Get particular Jewellery Data
export const getJewellery = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const jewellery = await Jewellery.findById(id);

		if (!jewellery) {
			return res.status(404).json({
				success: false,
				message: "Jewellery record not found",
				data: null,
			});
		}

		await getUploadedFileById(jewellery?.image._id.toString());
		res.status(200).json({
			success: true,
			message: "Jewellery record fetched successfully",
			data: jewellery,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// update jewellery record
export const updateJewellery = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { description, grossWeight, netWeight, price, stockStatus } =
			req.body;

		const jewellery = await Jewellery.findById(id);
		if (!jewellery) {
			return res.status(404).json({
				success: false,
				message: "Jewellery record not found",
				data: null,
			});
		}

		// Optional image update
		if (req.file && jewellery.image) {
			const updatedImage = await updateUploadedFileById(
				jewellery.image.toString(),
				req.file
			);
			jewellery.image = new mongoose.Types.ObjectId(updatedImage._id);
		}

		jewellery.description = description;
		jewellery.grossWeight = grossWeight;
		jewellery.netWeight = netWeight;
		jewellery.price = price;
		jewellery.stockStatus = stockStatus;

		const updatedJewellery = await jewellery.save();

		res.status(200).json({
			success: true,
			message: "Jewellery record has been updated successfully",
			data: updatedJewellery,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// delete jewellery record by id
export const deleteJewelleryById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const jewellery = await Jewellery.findById(id);
		if (!jewellery) {
			return res.status(404).json({
				success: true,
				message: "Jewellery record not found",
				data: null,
			});
		}
		await deleteUploadedFileById(jewellery.image.toString());
		await jewellery?.deleteOne();

		return res.status(200).json({
			success: true,
			message: "Jewellery entry and file was deleted",
			data: jewellery,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};
