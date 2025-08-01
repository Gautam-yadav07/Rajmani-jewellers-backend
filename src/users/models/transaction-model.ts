import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},

    planId:{type: mongoose.Schema.Types.ObjectId, ref: "savingPlan"},

    installmentNumber:{type:Number, required:true},

    amount:{type:Number, required:true},

    transactionDetails: {
        mode: { type: String, enum: ["online", "shop"], required: true },
        txnId: { type: String, required: true, unique: true },
        shopId: { type: String },
        transactionStatus: { type: String, enum: ["success", "failure"], required: true },
  },
}, {timestamps:true})

export const Transaction = mongoose.model("Transaction", transactionSchema)