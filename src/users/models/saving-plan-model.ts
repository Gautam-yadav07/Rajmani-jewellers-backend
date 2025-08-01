import mongoose from 'mongoose'
import { ISavingPlan } from '../../all-types/all-interface'
import { Installment } from './installment-model'
import { installmentSchema } from './installment-model'

const savingPlanSchema = new mongoose.Schema<ISavingPlan>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
    savingPlanName:{type:String, required: true},

    monthlyInstallment:{type:Number, required:true},

    tenure:{type:Number, default:12},

    totalPayment: {type:Number},

    specialBenefit:{type:Number},

    totalJewelleryWorth:{type:Number},

    nomineeName:{type:String, required:true},

    nomineeContact:{type:Number, required:true},

    nomineeRelation:{type:String, },

    startedOn: {type:Date},
    endedOn:  {type:Date},

    // from: {type:Date},
    // to:  {type:Date},

    planStatus:{type:String, enum:["active", "past", ""], default: ""},

    installments:[installmentSchema],

    totalPaid:{type:Number, default:0},

    redeemedStatus:{type:String, enum:["pending", "redeemed"], default:"pending"},

    redeemedDetails:{
        redeemedOn:{type:Date},
        amount:{type:Number,}
    }


}, {timestamps: true})

export const SavingPlan = mongoose.model("SavingPlan", savingPlanSchema)

