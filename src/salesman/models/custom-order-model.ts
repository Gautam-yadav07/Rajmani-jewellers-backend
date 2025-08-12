import mongoose from "mongoose"
import { ICustomOrder } from "../../all-types/all-interface"
import { productDetailSchema } from "./product-details-model"

const customOrderSchema = new mongoose.Schema<ICustomOrder>({

    customerDetails:{
        customerNameEng:{type:String},
        customerNameHin:{type:String},
        mobileNumber:{type: Number},
        address:{type:String},
      },
      paymentDetails:{
        cash:{type:Number},
        upi:{type:Number},
        pending:{type:Number},
        advanceAmount:{type:Number}
      },
      invoiceDetails:{
        voucherNo:{type:String},
        goldRate:{type:Number},
        date: {type: Date, default:Date.now},
        type:{type:String, enum:["sale", "purchase"]}
      },
      productDetails: [productDetailSchema]
}, {timestamps: true})
    
export const CustomOrder = mongoose.model("CustomOrder", customOrderSchema)