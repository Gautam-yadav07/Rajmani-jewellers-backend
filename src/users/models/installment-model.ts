import mongoose from "mongoose"
import { IInstallment } from "../../all-types/all-interface"

export const installmentSchema = new mongoose.Schema<IInstallment>({
    planId:{type:mongoose.Schema.Types.ObjectId},
    installmentNumber:{type: Number},
    status:{type: String, enum:["paid", 'due', "pending"]},
    amount:{type: Number},
    paymentDate:{type:Date},
    transactionDetails: {
    mode: String,
    txnId: String,
    shopId: String, // If paid in store
    transactionStatus: {type:String, enum:["success", "failure"]}
  },
    dueDate: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    // paymentMode:{type:String, enum:["online", "shop"]},

})


export const Installment = mongoose.model("Installment", installmentSchema)