import { Request } from "express";
import { Types } from "mongoose";

export interface IUser {
    userName: string;
    phoneNumber: number;
    goldBalance:number;
}
export interface IAdmin {
    userName: string;
    password: string;
    phoneNumber: number;
    image: Types.ObjectId;
}
export interface JwtPayload {
    id: string  ;
    role: string;
    userId:string;
}
export interface IMediaFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer?: Buffer;
    fileLocation?: string;
    _id?: string;
}
export interface IJewellery {
    image: Types.ObjectId;
    description: string;
    grossWeight: string;
    netWeight: string;
    price: string;
    stockStatus: Stock;
}
export interface IGoldPrice {
    price18k?: string;
    price20k?: string;
    price22k?: string;
    price24k?: string;
    date?: Date;
}
enum Stock {
    InStock = "inStock",
    ComingSoon = "comingSoon",
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
    cookies: {
        token?: string;
    };
}

export interface ISavingPlan {
  userId: Types.ObjectId
  savingPlanName: string,
  monthlyInstallment: number,
  tenure: number,
  totalPayment:number,
  specialBenefit:number,
  totalJewelleryWorth: number;
  nomineeName:string;
  nomineeRelation:string;
  nomineeContact:number;
  startedOn: Date;
  endedOn: Date;
//   from: Date;
//   to: Date;
  planStatus: "active" | "past" | "";
  totalPaid: number;
  installments: IInstallment[]
  redeemedStatus:"pending"|"redeemed",
  redeemedDetails:{
    redeemedOn: Date,
    amount: number
  }
 
}
enum payment {
     Online= "online",
     Shop = "shop",
}

export interface IInstallment  {
    planId: Types.ObjectId;
    installmentNumber: number;
    status: "pending"|"paid"|"due";
    amount: number;
    dueDate: {
        from: Date;
        to: Date; };
    paymentDate:Date;
    transactionDetails:ITransactionDetails
    // mpinUsed?: boolean;
    // paymentMode?:payment;

}
interface ITransactionDetails {
  mode: payment;
  txnId: string;
  shopId?: string; // Optional if only present when paid in store
  transactionStatus:"success"| "failure",
}

export interface ITransaction{
    userId: Types.ObjectId;
    savingPlanId: Types.ObjectId;
    isntallmentNumber: number;
    amount: number;
    transactionDetails:ITransactionDetails
}




