"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.addUser = void 0;
const user_model_1 = require("../models/user-model");
const generateToken_1 = require("../../utils/generateToken");
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, phoneNumber } = req.body;
        if (!userName || !phoneNumber) {
            return res.status(400).json({ message: "userName and phoneNumber are required" });
        }
        const existingUser = yield user_model_1.User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser = new user_model_1.User({ userName, phoneNumber });
        yield newUser.save();
        return res.status(201).json({ message: "User added successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.addUser = addUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, userName } = req.body;
        if (!phoneNumber || !userName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = yield user_model_1.User.findOne({ phoneNumber });
        if (!user || user.userName !== userName) {
            return res.status(404).json({
                message: "Incorrect phone number or username",
                success: false
            });
        }
        const userObj = user.toObject();
        return (0, generateToken_1.generateToken)(res, {
            _id: user._id.toString(),
            userName: user.userName,
            phoneNumber: Number(user.phoneNumber), // ensure type matches IUser
        }, `welcome backe ${user.userName}`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
});
exports.login = login;
