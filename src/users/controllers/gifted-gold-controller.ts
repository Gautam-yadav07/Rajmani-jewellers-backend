import mongoose from "mongoose";
import { GiftedGold } from "../models/gifted-gold-model";
import { User } from "../models/user-model";
import {Request, Response} from "express"


export const giftGold = async (req:Request, res:Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderPhone, receiverPhone, goldInGrams } = req.body;

    const sender = await User.findOne({ phoneNumber: senderPhone }).session(session);
    const receiver = await User.findOne({ phoneNumber: receiverPhone }).session(session);

    if (!sender || !receiver) {
      throw new Error("Sender or Receiver not found or not registered.");
    }

    if (sender.goldBalance < goldInGrams) {
      throw new Error("Insufficient balance");
    }else if(sender.goldBalance == 0){
        throw new Error ("You have No Gold balance to Gift")
    }
    

    // Update balances
    sender.goldBalance -= goldInGrams;
    receiver.goldBalance += goldInGrams;

    await sender.save({ session });
    await receiver.save({ session });

    // Log transaction
    await GiftedGold.create([{
      senderId: sender._id,
      receiverId: receiver._id,
      goldInGrams
    }], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Gold gifted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
