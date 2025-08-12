import mongoose from 'mongoose'
import { IInvoice } from '../../all-types/all-interface'
import { productDetailSchema } from './product-details-model'

const invoiceSchema  = new mongoose.Schema<IInvoice>({
  customerDetails:{
    customerNameEng:{type:String, required:true},
    customerNameHin:{type:String, required:true},
    mobileNumber:{type: Number, required:true},
    address:{type:String},
  },
  paymentDetails:{
    cash:{type:Number},
    upi:{type:Number},
    pending:{type:Number},
    totalPaid:{type:Number}
  },
  invoiceDetails:{
    billNo:{type:String,required:true},
    goldRate:{type:Number,required:true},
    date: {type: Date,required:true, default:Date.now},
    type:{type:String, enum:["sale", "purchase"]}
  },
  productDetails: [productDetailSchema]
    

}, {timestamps: true})

export const Invoice = mongoose.model("Invoice", invoiceSchema)