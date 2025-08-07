import mongoose from "mongoose"
import { Request, Response } from "express";
import _ from "lodash";
import { CustomOrder } from "../models/custom-order-model"; 
import { ICustomOrder } from "../../all-types/all-interface";


export const createCustomOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerDetails,
      paymentDetails,
      invoiceDetails,
      productDetails,
    }: ICustomOrder = req.body;

    // Validate customerDetails
    if (
      !customerDetails ||
      !customerDetails.customerNameEng ||
      !customerDetails.address ||
      !customerDetails.mobileNumber
    ) {
      return res.status(400).json({ success: false, message: "Customer Details are required." });
    }

    // Validate invoiceDetails
    if (
      !invoiceDetails ||
      !invoiceDetails.voucherNo ||
      !invoiceDetails.goldRate ||
      !invoiceDetails.date ||
      !invoiceDetails.type
    ) {
      return res.status(400).json({ success: false, message: "Invoice details are incomplete or invalid." });
    }

    // Validate productDetails
    if (productDetails.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product is required." });
    }

    let totalExpectedAmount = 0;

    for (const product of productDetails) {
        const {
            productName,
            weightFrom,
            weightTo,
            purity,
            ratePerGram,
            expectedDeliveryDate,
            expectedAmount,
            workerName,
        }= product;

      if (!productName || !weightFrom || !weightTo || !ratePerGram ||
        !expectedDeliveryDate || !expectedAmount || !workerName || !purity) {
        return res.status(400).json({
          success: false,
          message: "All required product fields must be filled.",
        });
      }

      totalExpectedAmount += expectedAmount;
    }

    const cash = paymentDetails?.cash || 0;
    const upi = paymentDetails?.upi || 0;
    const advanceAmount = cash + upi

    const pendingAmount = totalExpectedAmount - advanceAmount;
    

    const newOrder = new CustomOrder({
      customerDetails,
      paymentDetails:{
        ...paymentDetails,
        pending: pendingAmount,
        advanceAmount:advanceAmount
      },
      invoiceDetails,
      productDetails,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Custom order created successfully.",
      savedOrder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: (error as Error).message,
    });
  }
};

export const getAllCustomOrders = async (req: Request, res: Response) => {
  try {
    const orders = await CustomOrder.find() 
    if(!orders){
      return res.status(404).json({success:false, message:"No orders Found"})
    }
    res.status(200).json({
      success: true,
      message: "Custom orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching custom orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error .",
      error: (error as Error).message,
    });
  }
};

export const getCustomOrderById = async(req: Request, res: Response)=>{
  try {
    const {orderId} = req.params
    if(!orderId){
      return res.status(404).json({success:false, message:"No order found"})
    }

    const order = await CustomOrder.findById(orderId)
    if(!order){
      return res.status(404).json({success:false, message:"No order Found"})
    }

    return res.status(201).json({
      success:true,
      message:"Order fetched successfully",
      order
    })
    
  } catch (error) {
    return res.status(500).json({success:false, message:"Server Error", error: (error as Error).message})
  }
}
export const  getCustomOrderByName = async(req:Request, res: Response)=>{
  try {
    const {name}= req.params
    if(!name){
      return res.status(400).json({success:false, message:"Name is required"})
    }

    const customOrder = await CustomOrder.find({"customerDetails.customerNameEng":name})
    if(!customOrder || customOrder.length === 0){
      return res.status(404).json({success:false, message:"No custom order found"})
    }

    return res.status(201).json({success:true, customOrder})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Server error",
      error:(error as Error).message
    })
  }
}
export const getCustomeOrderByProductName = async(req: Request, res: Response)=>{
    try {
        const {productname} = req.params
        if(!productname){
            return res.status(404).json({success:false, message:"product name is required"})
        }
        const invoice = await CustomOrder.find({"productDetails.productName":productname })
        if(!invoice || invoice.length ===0){
            return res.status(404).json({success:false, message: "No custome order found"})

        }
        return res.status(201).json({success:true, message:"order fetched succesfully", invoice})
        
    } catch (error) {
        return res.status(500).json({success:false, message:"server error", error: (error as Error).message})
    }
}
export const deleteCustomOrder = async(req: Request, res: Response)=>{
  try {
    const {orderId} = req.params
   if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid order Id" });
      }
      

    const order = await CustomOrder.findByIdAndDelete(orderId)
    if(!order){
      return res.status(404).json({success:false, message:"No order Found"})
    }

    return res.status(201).json({
      success:true,
      message:"Order deleted successfully",
      order
    })
    
  } catch (error) {
    return res.status(500).json({success:false, message:"Server Error", error: (error as Error).message})
  }
}

export const updateCustomeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

  

    //  Update only sent fields
    const customOrder = await CustomOrder.findById(id);

    if (!customOrder) {
      return res.status(404).json({
        success: false,
        message: "Custom order not found",
      });
    }
    _.merge(customOrder, req.body);

    const updatedOrder = await customOrder.save();

    return res.status(200).json({
      success: true,
      message: "Custom order updated successfully",
      data: updatedOrder,
    });

  } catch (error) {
    console.error("Error updating custom order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating order",
    });
  }
};



// hello world 2028