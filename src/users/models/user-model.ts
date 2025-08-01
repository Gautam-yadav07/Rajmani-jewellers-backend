import mongoose from "mongoose"
import { IUser } from "../../all-types/all-interface"
const userSchema = new mongoose.Schema<IUser>({
    userName: String,
    phoneNumber: String,
    goldBalance:{type:Number, default:0 }
})

export const User = mongoose.model("User", userSchema)
