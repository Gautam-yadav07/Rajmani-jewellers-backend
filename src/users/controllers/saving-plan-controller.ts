import mongoose from 'mongoose'
import { SavingPlan } from "../models/saving-plan-model";
import {Request, Response} from "express"
import { AuthenticatedRequest } from '../../all-types/all-interface';
import { Transaction } from '../models/transaction-model';


// Create a new saving plan
export const createSavingPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { savingPlanName, monthlyInstallment, nomineeName, nomineeContact, nomineeRelation ,from } = req.body;
    const userId = req.user?.userId
    
    // console.log("hello" , userId);
    
    
   

    const fromDate = new Date(from);
    if (isNaN(fromDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid 'from' date format",
      });
     }

    //7 days date set for installment reminder
    // const toDate = new Date(fromDate);
    // toDate.setDate(toDate.getDate() + 7);



    //every month due date 
    const installments = [];
    for (let i = 1; i < 12; i++) {
    const dueFrom = new Date(fromDate.getFullYear(), fromDate.getMonth() + i, fromDate.getDate());
    const dueTo = new Date(dueFrom);
    dueTo.setDate(dueFrom.getDate() + 7);

      // initialization
      installments.push({
      installmentNumber:i,
      amount: monthlyInstallment,
      status: 'pending',
      paymentDate : null,
      transactionDetails:{},
      dueDate: {
      from: dueFrom,
      to: dueTo,
      },
      
    });
  }

    const totalPayment = monthlyInstallment * 11;
    const specialBenefit = monthlyInstallment * 1; //
    const totalJewelleryWorth = totalPayment + specialBenefit;
    
    const plan = await SavingPlan.create({
      userId,
      savingPlanName,
      monthlyInstallment,
      
      totalPayment,
      specialBenefit,
      totalJewelleryWorth,
      nomineeName,
      nomineeContact,
      nomineeRelation,
      installments,
      // from:fromDate,
      // to: toDate
      
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// pay online logic (ambiquity)
// Activate plan on first payment
export const activatePlan = async (req: AuthenticatedRequest, res: Response) => {

  try {
    const planId = req.params.id
    const { installmentIndex, txnDetails } = req.body;

    const plan = await SavingPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });


     const installment = plan.installments[installmentIndex-1];

    if (!installment) {
      return res.status(400).json({ success: false, message: 'Invalid installment index' });
    }
     if (installment.status === 'paid') {
      return res.status(400).json({ success: false, message: `Installment ${installmentIndex} is already paid.` });
    }

    

    await Transaction.create({
        userId: plan.userId,
        planId: plan._id,
        installmentNumber:installmentIndex,
        amount: installment.amount,

        transactionDetails:{
          mode:txnDetails.mode,
          txnId: txnDetails.txnId,
          transactionStatus:txnDetails.transactionStatus
        },
        transactionStatus: txnDetails.transactionStatus,

      })

      // Update the first installment
    if(txnDetails.transactionStatus === "success"){
    plan.installments[installmentIndex-1].status = 'paid';
    plan.installments[installmentIndex-1].paymentDate = new Date();
    plan.installments[installmentIndex-1].transactionDetails = txnDetails;

    plan.totalPaid += installment.amount;

    // Activate if it's the first payment
    if (!plan.planStatus) {
      plan.startedOn = new Date();
      plan.endedOn = new Date(
        plan.startedOn.getFullYear(),
        plan.startedOn.getMonth() + 12,
        plan.startedOn.getDate()
      );
      plan.planStatus = "active";
    }

      

    await plan.save();
    return res.status(200).json({ success: true, message:"Installment paid and plan activated", data: plan });
  }else{
    return res.status(400).json({success:false, message:"Transaction Failed"})
  }
 } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Get only active plans of user
export const getActivePlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    console.log(req.user?.userId)
    const plans = await SavingPlan.find({ userId, planStatus: "active" });
    if(plans.length === 0){
      return res.status(404).json({
        success:false,
        message: "You have no active plan"
      })
    }
    
    if(!plans){
      res.status(404).json({
        success:false,
        message:"No Active Plans"
      })

    }

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error });
  }
};

// get all saving plan of a user (irrespective of plane status i.e active, reedemed , past, pending)

export const getAllSavingPlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const plans = await SavingPlan.find({userId}) 
    if(!plans || plans.length === 0){
      return res.status(400).json({success:false, message:"No plan found"})
    }

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// to get saving plane by it's id 
export const getSavingPlanById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { planId } = req.params;
    const userId = req.user?.userId

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ success: false, message: "Invalid Plan ID" });
    }

    const plan = await SavingPlan.findById({_id: planId, userId}).populate("userId", "userName phoneNumber");

    if (!plan) {
      return res.status(404).json({ success: false, message: "Saving plan not found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


//  Update Saving Plan by ID
export const updateSavingPlan = async (req: Request, res: Response) => {
  try {
    const {planId} = req.params;

    // Check if plan ID is valid
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid saving plan ID provided.",
      });
    }

    
    const updatedPlan = await SavingPlan.findByIdAndUpdate(planId, req.body, {
      new: true,            
      runValidators: true,  
    });

    
    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "No saving plan found with the given ID.",
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Saving plan updated successfully.",
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Update Saving Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the saving plan.",
      error,
    });
  }
};

// Delete Saving Plan by ID (optional)
export const deleteSavingPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ success: false, message: "Invalid Plan ID" });
    }

    const deletedPlan = await SavingPlan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ success: false,  message: "Saving plan not found" });
    }

    res.status(200).json({ success: true, message: "Saving plan deleted successfully",deletedPlan, });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting saving plan", error });
  }
};


export const redeemPlan = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params; // 
  const userId = req.user?.userId;

  try {
    const plan = await SavingPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    console.log(userId)
    if (plan.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access...." });
    }

    if (plan.planStatus !== "past") {
      return res.status(400).json({ success: false, message: "Plan is not yet completed" });
    }

    if (plan.redeemedStatus === "redeemed") {
      return res.status(400).json({ success: false, message: "Plan already redeemed" });
    }

    //  Redeem 
    plan.redeemedStatus = "redeemed";
    plan.redeemedDetails = {
      redeemedOn: new Date(),
      amount: plan.totalJewelleryWorth,
    };

    await plan.save();

    return res.status(200).json({ success: true, message: "Plan redeemed successfully", data: plan });
  } catch (err) {
    console.error(" Redeem Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



