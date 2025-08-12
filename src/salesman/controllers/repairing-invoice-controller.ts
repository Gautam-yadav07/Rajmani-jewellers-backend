import mongoose from "mongoose";
import _ from 'lodash';
import { Request, Response } from "express";
import { IRepairingInvoice } from "../../all-types/all-interface";
import { RepairingInvoice } from "../models/repairing-invoice-model";



// create Repairing Invoice
export const createRepairingInvoice = async(req: Request, res:Response)=>{
    try {
        const {customerDetails, paymentDetails, productDetails, invoiceDetails}:IRepairingInvoice = req.body;


        if(!customerDetails || !paymentDetails || !productDetails || !invoiceDetails){
            return res.status(400).json({success:false, message:"All the fields are required"})
        }

        if (
            !customerDetails ||
            !customerDetails.customerNameEng ||
            !customerDetails.customerNameHin ||
            !customerDetails.address ||
            !customerDetails.mobileNumber
        ) {
        return res.status(400).json({ success: false, message: "Customer Details are required." });
        }


        if (
            !invoiceDetails ||
            !invoiceDetails.date 
         
        ) {
        return res.status(400).json({ success: false, message: "Invoice details are incomplete or invalid." });
        }


        if (productDetails.length === 0) {
            return res.status(400).json({ success: false, message: "At least one product is required." });
        }

        let totalExpectedAmount = 0;

        for (const product of productDetails) {
        const {
            productName,
            finalAmount,
            netWeight,
            metal,
            description,

        }= product;

        if (!productName || !finalAmount || !netWeight || !metal || !description) {
            return res.status(400).json({
            success: false,
            message: "All required product fields must be filled.",
            });
        }

            totalExpectedAmount += finalAmount
        }
           

        // const cash = paymentDetails?.cash || 0;
        // const upi = paymentDetails?.upi || 0;

        
        const totalPaid = paymentDetails.cash ||0 + paymentDetails.upi||0
        
    
        const pendingAmount = totalExpectedAmount - totalPaid;

        const repairingInvoice = new RepairingInvoice({
            customerDetails,
            paymentDetails:{
            ...paymentDetails,
            pending: pendingAmount,
            totalPaid :totalPaid
            },
            invoiceDetails,
            productDetails,
        });
    
        const savedRepairingInvoice = await repairingInvoice.save();

        return res.status(201).json({success:true, message:"Repairing Jewellery Invoice created Succesfully", savedRepairingInvoice})

        
    } catch (error) {
        return res.status(500).json({success:false, message:"Server error", error: (error as Error).message})
        
    }
}

// get all repairing invoice
export const getAllRepairingInvoice = async (req:Request, res: Response)=>{
    try {
        const repairingInvoice = await RepairingInvoice.find()
        if(!repairingInvoice|| repairingInvoice.length ===0){
            return res.status(400).json({success:false, message:"No repairing invoice found"})
        }
        return res.status(201).json({success:true, message:"Invoice fetched succesfully", repairingInvoice})
    } catch (error) {
        return res.status(500).json({success:false, message:"server error", error: (error as Error).message})
        
    }
}

// get repairing invoice by customer name
export const getRepairingInvoiceByName = async(req:Request, res: Response)=>{
    try {
        const {name} = req.params
        if(!name){
            return res.status(400).json({success:false, messsage:"provide Customer name"})
        }

        const repairingInvoice = await RepairingInvoice.find({"customerDetails.customerNameEng":name})
        if(!repairingInvoice || repairingInvoice.length ===0){
            return res.status(404).json({successs:false, message:"No Repairing Invoice found"})
        }

        return res.status(200).json({success:true, message:"Invoice found succesfully", repairingInvoice})
    } catch (error) {
        return res.status(500).json({success:false, message:"Server error", error: (error as Error).message})
        
    }
}

//get repairing invoice by product name
export const getRepairingInvoiceByProductName = async(req:Request, res: Response)=>{
    try {
        const {productname} = req.params
        const repairingInvoice = await RepairingInvoice.find({"productDetails.productName":productname})

        if(!repairingInvoice || repairingInvoice.length ===0 ){
            return res.status(404).json({success:false, message:"No record found for this product name"})
        }

        return res.status(201).json({success:true, message:"Invoice fetched succesfully", repairingInvoice})
    } catch (error) {
        return res.status(500).json({success:false, message:"server error", error: (error as Error).message})
    }
}
// get repairing invoice by id
export const getRepairingInvoiceById = async (req:Request, res:Response)=>{
    try {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid invoice Id" });
        }

        const repairingInvoice = await RepairingInvoice.findById(id)
        if(!repairingInvoice){
            return res.status(400).json({success:false, message:"No repairing jewellery invoice found"})
        }

        return res.status(201).json({success:true, message:"Invoice fetched Succesfully", repairingInvoice})
    } catch (error) {
        return res.status(500).json({success:false, message:"Server error", error: (error as Error).message})
        
    }
}

// update repairing invoice
export const updateRepairingInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Provide invoice Id" });
    }

    const invoice = await RepairingInvoice.findById(id)
    if(!invoice){
        return res.status(404).json({ success: false, message: "Invoice not found..." });
    }

    _.merge(invoice, updateData);
    await invoice.save()
    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

//delete repairing invoice
export const deleteRepairingInvoice = async(req: Request, res: Response)=>{
    try {
        const {id} = req.params;
        const repairingInvoice = await RepairingInvoice.findByIdAndDelete(id);
        if(!repairingInvoice){
            return res.status(404).json({success:false, message:"No Invoice found"})
        }
        return res.status(201).json({success:true, message:"Invoice deleted succesfully", repairingInvoice})
        
    } catch (error) {
        return res.status(500).json({success:false, message:"server Error", error: (error as Error).message})
        
    }
}



