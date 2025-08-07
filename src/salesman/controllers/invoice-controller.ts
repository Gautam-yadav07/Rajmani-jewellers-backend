import mongoose from "mongoose";
import { Invoice } from "../models/invoice-model";
import { Request, Response } from "express";
import { IInvoice, IProductDetails } from "../../all-types/all-interface";
import _ from 'lodash'


//create invoice
export const createInvoice = async (req: Request, res: Response)=>{
    try {
        const {invoiceDetails, productDetails, paymentDetails, customerDetails}:IInvoice = req.body

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
      !invoiceDetails.billNo ||
      !invoiceDetails.goldRate ||
      !invoiceDetails.date ||
      !invoiceDetails.type
    ) {
      return res.status(400).json({ success: false, message: "Invoice details are incomplete or invalid." });
    }

    if (productDetails.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product is required." });
    }

        let totalFinalAmount = 0

        const paymentToPay = productDetails.map((item:IProductDetails)=>{
            const value = parseFloat((item.piece * (item.netWeight * item.ratePerGram)).toFixed(2))

            const labourchargesInRs  = parseFloat(((item.labourChargesInPer /100)*value).toFixed(2))

            const finalAmount = (value + labourchargesInRs + (item.additionalAmount ||0) -(item.discountAmount || 0) )



            totalFinalAmount += finalAmount

            return {
                ...item, value, labourchargesInRs, finalAmount
            }
        })

        const cash = paymentDetails?.cash || 0;
        const upi = paymentDetails?.upi || 0;
        const totalPaid = cash + upi;
        const pending = totalFinalAmount - totalPaid;


        // const totalPaid =
        //     (paymentDetails?.cash || 0) +
        //     (paymentDetails?.upi || 0) +
        //     (paymentDetails?.pending || 0);

        // if (totalFinalAmount !== totalPaid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Final amount (${totalFinalAmount}) does not match total paid (${totalPaid})`,
        //     });
        // }

        const newInvoice = await Invoice.create({
            customerDetails,
            invoiceDetails,
            productDetails:paymentToPay,
            paymentDetails:{
                ...paymentDetails,
                totalPaid,
                pending
            }
        });
        return res.status(201).json({
            success: true,
            message: "Invoice created succesfully",
            newInvoice
        })


    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error", error: (error as Error).message,})
    }
}

// get all invoice
export const getAllInvoices = async (req: Request, res: Response)=>{
    try {
        const allInvoices = await Invoice.find()
        if(!allInvoices || allInvoices.length === 0){
            return res.status(404).json({
                success:false,
                message: "No Invoice Found"
            })
        }
        return res.status(200).json({
            success:true,
            message: "All invoices",
            allInvoices
        })
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error", error: (error as Error).message,})
    }
};

// get invoice by id
export const getInvoiceById = async (req:Request, res: Response)=>{
    try {
        const {invoiceId} = req.params

        if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
            return res.status(400).json({ success: false, message: "Invalid invoice Id" });
        }
        
        const invoice = await Invoice.findById({_id: invoiceId})
    
        if (!invoice) {
            return res.status(404).json({ success: false, message: " invoice  not found" });
        }
         res.status(200).json({ success: true, invoice });
        
        
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"})
        
    }
}

// get invoice by customer name
export const getInvoiceByName = async(req:Request,res:Response)=>{
    try {
        const {name} = req.params
        if(!name){
            return res.status(400).json({success:false, message:"Customer name is required"})
        }

        const invoice = await Invoice.find({
            "customerDetails.customerNameEng":name
            });

        if(invoice.length ===0){
            return res.status(404).json({success:false, message:"No invoice Found with this name"})
        }
        
        return res.status(200).json({success:true, invoice})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error", error: (error as Error).message,})
    }
}
// get invoice by bill number
export const getInvoiceByBillNo = async(req: Request, res: Response)=>{
    try {
        const {billNo} = req.params
        if(!billNo){
            return res.status(404).json({success:false, message:"Bill Number is required "})
        }

        const invoice = await Invoice.find({
            "invoiceDetails.billNo": billNo
        })
    
         if(!invoice || invoice.length ===0){
            return res.status(404).json({success:false, message:"No invoice Found with this Bill number"})
        }

        return res.status(200).json({success:true, message:"Invoice found successfully", invoice})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error", error: (error as Error).message,})
    }

}

//get invoice by product name
export const getInvoiceByProductName = async(req: Request, res: Response)=>{
    try {
        const {productname} = req.params
        if(!productname){
            return res.status(404).json({success:false, message:"product name is required"})
        }
        const invoice = await Invoice.find({"productDetails.productName":productname })
        if(!invoice || invoice.length ===0){
            return res.status(404).json({success:false, message: "No invoice found"})

        }
        return res.status(201).json({success:true, message:"Invoice fetched succesfully", invoice})
        
    } catch (error) {
        return res.status(500).json({success:false, message:"server error", error: (error as Error).message})
    }
}
//update invoice
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

  

    //  Update only sent fields
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    _.merge(invoice, req.body);

    const updatedInvoice = await invoice.save();

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating Invoice",
    });
  }
};
// delete invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

    if (!deletedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      deletedInvoice
    });

  } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error", error: (error as Error).message,})
    }
};

