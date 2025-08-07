import { Request, Response } from "express";
import { Invoice } from "../models/invoice-model";
import { RepairingInvoice } from "../models/repairing-invoice-model";
import { Dashboard } from "../models/dashboard-model";

export const getPaymentSummaryByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required in query params",
      });
    }

    const selectedDate = new Date(date as string);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);

    // Find all invoices on selected date
    const invoiceRecords = await Invoice.find({
      "invoiceDetails.date": {
        $gte: selectedDate,
        $lt: nextDate,
      },
    });

    // Find all repairing records on selected date
    const repairingRecords = await RepairingInvoice.find({
      "invoiceDetails.date": {
        $gte: selectedDate,
        $lt: nextDate,
      },
    });

    const sales = { totalCash: 0, totalUpi: 0, totalPending: 0 };
    const repairing = { totalCash: 0, totalUpi: 0, totalPending: 0 };

    for (const invoice of invoiceRecords) {
      sales.totalCash += invoice.paymentDetails?.cash || 0;
      sales.totalUpi += invoice.paymentDetails?.upi || 0;
      sales.totalPending += invoice.paymentDetails?.pending || 0;
    }

    for (const repair of repairingRecords) {
      repairing.totalCash += repair.paymentDetails?.cash || 0;
      repairing.totalUpi += repair.paymentDetails?.upi || 0;
      repairing.totalPending += repair.paymentDetails?.pending || 0;
    }

    const totalSale = {
      cash: sales.totalCash,
      upi: sales.totalUpi,
      pending: sales.totalPending,
      total: sales.totalCash + sales.totalUpi + sales.totalPending,
    };

    const totalRepair = {
      cash: repairing.totalCash,
      upi: repairing.totalUpi,
      pending: repairing.totalPending,
      total: repairing.totalCash + repairing.totalUpi + repairing.totalPending,
    };

    // ✅ Upsert dashboard entry for the date
    await Dashboard.findOneAndUpdate(
      { date: selectedDate },
      { totalSale, totalRepair },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      sales: totalSale,
      repairing: totalRepair,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
