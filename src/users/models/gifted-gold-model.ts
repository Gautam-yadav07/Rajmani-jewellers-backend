import mongoose from "mongoose"
const giftedGoldSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
   
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    goldInGrams:{
        type:Number,
        required:true
    }
   
   

}, {timestamps:true})

export const GiftedGold = mongoose.model("GiftedGold", giftedGoldSchema)

