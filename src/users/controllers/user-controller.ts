import { User } from "../models/user-model";
import { Request, Response } from "express";
import { generateToken } from "../../utils/generateToken";
import { AuthenticatedRequest } from "../../all-types/all-interface";
export const addUser = async (req: Request, res:Response) => {
    try {
        const { userName, phoneNumber , goldBalance } = req.body;

        if (!userName || !phoneNumber) {
            return res.status(400).json({success:false, message: "userName and phoneNumber are required" });
        }

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }


        const newUser = new User({ userName, phoneNumber, goldBalance });
        await newUser.save();

        return res.status(201).json({newUser, message: "User added successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};



export const login = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { phoneNumber, userName } = req.body;

        if (!phoneNumber || !userName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ phoneNumber });

        if (!user || user.userName !== userName) {
            return res.status(404).json({
                message: "Incorrect phone number or username",
                success: false
            });
        }

        

        return generateToken(res, 
        user._id.toString(),  `welcome back ${user.userName}`);

        //generateToken(res, user, `WelCome back ${user.userName}`)
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};

