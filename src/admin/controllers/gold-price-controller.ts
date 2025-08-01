import { Request, Response } from "express";
import { GoldPrice } from "../models/gold-price-model";
import { IGoldPrice } from "../../all-types/all-interface";
// create goldPrice
export const createGoldPrice = async (req: Request, res: Response) => {
	try {
		const { price18k, price20k, price22k, price24k, date } = req.body;
		const goldPrice = new GoldPrice({
			price18k,
			price20k,
			price22k,
			price24k,
			date,
		});
		await goldPrice.save();
		return res.status(201).json({
			success: true,
			message: "New gold price record has been set",
			data: goldPrice,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

//Get all priceList
export const getAllGoldPrices = async (req: Request, res: Response) => {
	try {
		const allGoldPrices = await GoldPrice.find();
		return res.status(200).json({
			success: true,
			message: "List of all prices",
			data: allGoldPrices,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// get particular priceList By id
export const getParticularGoldPriceById = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;
		const goldPrice = await GoldPrice.findById(id);

		if (!goldPrice) {
			return res.status(404).json({
				success: false,
				message: "Gold price record not found",
				data: null,
			});
		}
		res.status(200).json({
			success: true,
			message: "Gold Price record fetched successfully",
			data: goldPrice,
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// get particular priceList by Date
export const getParticularGoldPriceByDate = async (
	req: Request,
	res: Response
) => {
	try {
		const { date } = req.params;
		if (!date) {
			return res.status(404).json({
				success: true,
				message: "Please provide date in parameter",
				data: null,
			});
		}
		const targetedDate = new Date(date);
		const start = new Date(targetedDate.setHours(0, 0, 0, 0));
		const end = new Date(targetedDate.setHours(23, 59, 59, 9999));

		const updatedPriceList = await GoldPrice.findOne({
			date: { $gte: start, $lte: end },
		});

		if (!updatedPriceList) {
			return res.status(404).json({
				success: false,
				message: "Gold price for provided date not found",
				data: null,
			});
		}

		return res.status(200).json({
			status: true,
			message: "Successfully fetched gold price for particular date",
			data: updatedPriceList,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// update particular priceList by Id
export const updateParticularGoldPriceById = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;
		const { price18k, price20k, price22k, price24k } = req.body;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Please provide id in parameters",
				data: null,
			});
		}
		const updatedData: IGoldPrice = {};
		if (price18k !== undefined) updatedData.price18k = price18k;
		if (price20k !== undefined) updatedData.price20k = price20k;
		if (price22k !== undefined) updatedData.price22k = price22k;
		if (price24k !== undefined) updatedData.price24k = price24k;

		const goldPrice = await GoldPrice.findByIdAndUpdate(id, updatedData, {
			new: true,
		});

		if (!goldPrice) {
			return res.status(404).json({
				success: false,
				message: "Gold price record not found",
				data: null,
			});
		}
		res.status(200).json({
			success: true,
			message: "Gold Price record updated successfully",
			data: goldPrice,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

// update particular priceList by Date
export const updateParticularGoldPriceByDate = async (
	req: Request,
	res: Response
) => {
	try {
		const { date } = req.params;
		const { price18k, price20k, price22k, price24k } = req.body;

		if (!date) {
			return res.status(404).json({
				success: true,
				message: "Please provide date",
				data: null,
			});
		}
		const targetedDate = new Date(date);
		const start = new Date(targetedDate.setHours(0, 0, 0, 0));
		const end = new Date(targetedDate.setHours(23, 59, 59, 999));

		const updatedData: IGoldPrice = {};
		if (price18k !== undefined) updatedData.price18k = price18k;
		if (price20k !== undefined) updatedData.price20k = price20k;
		if (price22k !== undefined) updatedData.price22k = price22k;
		if (price24k !== undefined) updatedData.price24k = price24k;

		const goldPrice = await GoldPrice.findOneAndUpdate(
			{ date: { $gte: start, $lte: end } },
			updatedData,
			{ new: true }
		);

		if (!goldPrice) {
			return res.status(404).json({
				success: false,
				message: "Gold price record not found",
				data: null,
			});
		}
		res.status(200).json({
			success: true,
			message: "Gold Price record updated successfully",
			data: goldPrice,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

//find by id and delete
export const deleteJewelleryById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Please provide id in parameters",
				data: null,
			});
		}
		const goldPrice = await GoldPrice.findById(id);
		if (!goldPrice) {
			return res.status(404).json({
				success: true,
				message: "Gold price record not found",
				data: null,
			});
		}
		await goldPrice?.deleteOne();

		return res.status(200).json({
			success: true,
			message: "Gold price entry deleted successfully",
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

//find by date and delete
export const deleteJewelleryByDate = async (req: Request, res: Response) => {
	try {
		const { date } = req.params;
		if (!date) {
			return res.status(404).json({
				success: true,
				message: "Please provide date in parameter",
				data: null,
			});
		}
		const targetedDate = new Date(date);
		const start = new Date(targetedDate.setHours(0, 0, 0, 0));
		const end = new Date(targetedDate.setHours(23, 59, 59, 9999));
		await GoldPrice.findOneAndDelete({ date: { $gte: start, $lte: end } });
		return res.status(200).json({
			success: true,
			message: "Record deleted successfully",
			data: null,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};
