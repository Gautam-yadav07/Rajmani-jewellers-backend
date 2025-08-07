import mongoose from "mongoose";
import { IRepairingInvoice } from "../../all-types/all-interface";
import { productDetailSchema } from "./product-details-model";

const repairingInvoiceSchema = new mongoose.Schema<IRepairingInvoice>({
    
    customerDetails:{
        customerNameEng:{type:String},
        customerNameHin:{type:String},
        mobileNumber:{type:Number},
        address:{type:String}
       
    },
    productDetails:[productDetailSchema],
    invoiceDetails:{
        date:{type:Date}
    },
    paymentDetails:{
        cash:{type:Number},
        upi:{type:Number},
        pending:{type:Number},
        totalPaid:{type:Number}
    }

})
export const RepairingInvoice = mongoose.model("RepairingInvoice", repairingInvoiceSchema)
    