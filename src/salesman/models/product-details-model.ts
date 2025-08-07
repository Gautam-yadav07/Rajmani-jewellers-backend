import mongoose from "mongoose";
import { IProductDetails } from "../../all-types/all-interface";


export const productDetailSchema = new mongoose.Schema<IProductDetails>({

    productName: { type: String },
  remark: { type: String },
  piece: { type: Number },
  purity: { type: Number },
  grossWeight: { type: Number },
  netWeight: { type: Number },
  lessWeight: { type: Number },
  ratePerGram: { type: Number },
  value: { type: Number },
  stoneRate: { type: Number },
  labourChargesInPer: { type: Number },
  labourChargesInRs: { type: Number },
  finalAmount: { type: Number },
  additionalAmount: { type: Number },
  discountAmount: { type: Number },
  weightFrom: { type: Number },
  weightTo: { type: Number },
  width: { type: Number },
  rateCut: { type: Boolean },
  expectedDeliveryDate: { type: Date },
  description: { type: String },
  expectedAmount: { type: Number },
  workerName: { type: String },
  metal: { type: String },
  stoneWeight: { type: Number },
  size: { type: Number },
  tagNo:{type:Number}

})


export const ProductDetails = mongoose.model("ProductDetails", productDetailSchema)