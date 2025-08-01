// // controllers/installment-controller.ts
// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import { Installment } from "../models/installment-model";

// export const getInstallmentsByPlanId = async (req: Request, res: Response) => {
//   try {
//     const { planId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(planId)) {
//       return res.status(400).json({ success: false, message: "Invalid plan ID" });
//     }

//     const installments = await Installment.find({ planId }).sort({ installmentNumber: 1 });
//     return res.status(200).json({ success: true, installments });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Error fetching installments", error });
//   }
// };

// export const payInstallment = async (req: Request, res: Response) => {
//   try {
//     const { installmentId } = req.params;
//     const { paymentMode } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(installmentId)) {
//       return res.status(400).json({ success: false, message: "Invalid installment ID" });
//     }

//     const installment = await Installment.findById(installmentId);
//     if (!installment) {
//       return res.status(404).json({ success: false, message: "Installment not found" });
//     }

//     installment.status = "paid";
//     installment.paymentMode = paymentMode || "online";
//     installment.paymentDate = new Date();
//     await installment.save();

//     return res.status(200).json({ success: true, message: "Installment marked as paid", installment });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Payment failed", error });
//   }
// };
