// utils/generateInstallments.ts
import { IInstallment } from "../all-types/all-interface";
import mongoose from "mongoose";

export const generateInstallments = (
  planId: mongoose.Types.ObjectId,
  amount: number,
  startDate: Date
): Partial<IInstallment>[] => {
  const installments: Partial<IInstallment>[] = [];

  for (let i = 0; i < 11; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + i);

    installments.push({
      planId,
      installmentNumber: i + 1,
      status: "pending",
      amount,
      dueDate,
    });
  }

  return installments;
};
