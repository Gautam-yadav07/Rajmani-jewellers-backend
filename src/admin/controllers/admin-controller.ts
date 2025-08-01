import { Admin } from "../models/admin-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../all-types/all-interface";
import { config } from "dotenv";
import { saveUploadedFile } from "../../media/utils/save-uploaded-file";

config();
export const addOrLoginAdmin = async (req: Request, res: Response) => {
    try {
        const { userName, password, phoneNumber } = req.body;
        const existingAdmin = await Admin.findOne();
        let uploadedFile;
        if (req.file) {
            uploadedFile = await saveUploadedFile (req.file);
        }
        // If no admin exists, create one
        if (!existingAdmin) {
            const hashed = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({
                userName,
                password: hashed,
                phoneNumber,
                image: uploadedFile?._id,
            });
            const token = jwt.sign(
                { id: newAdmin._id, role: "admin" },
                process.env.JWT_SECRET as string
            );
            res.cookie("token", token);
            return res.json({
                success: true,
                message: "Admin created",
                data: newAdmin,
                token: token,
            });
        }
        // Admin exists
        const match = await bcrypt.compare(password, existingAdmin.password);
        if (existingAdmin.userName !== userName || !match) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid Credentials", data: null });
        }
        const token = jwt.sign(
            { id: existingAdmin._id, role: "admin" },
            process.env.JWT_SECRET as string
        );
        res.cookie("token", token);
        return res.json({
            success: true,
            message: "Admin logged in",
            data: existingAdmin,
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: (error as Error).message,
        });
    }
};
export const adminLogout = (req: Request, res: Response) => {
    try {
        return res.cookie("token", "").status(200).json({
            success: true,
            message: "Admin has been logout successfully!",
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: (error as Error).message,
        });
    }
};