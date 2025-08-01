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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrLoginAdmin = void 0;
const admin_model_1 = require("../models/admin-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const addOrLoginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const existingAdmin = yield admin_model_1.Admin.findOne();
        // If no admin exists, create one
        if (!existingAdmin) {
            const hashed = yield bcrypt_1.default.hash(password, 10);
            const newAdmin = yield admin_model_1.Admin.create({ userName, password: hashed });
            const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET);
            res.cookie("token", token);
            return res.json({ message: "Admin created", token });
        }
        // Admin exists 
        const match = yield bcrypt_1.default.compare(password, existingAdmin.password);
        if (existingAdmin.userName !== userName || !match) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingAdmin._id, role: "admin" }, process.env.JWT_SECRET);
        return res.json({ message: "Admin logged in", token });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});
exports.addOrLoginAdmin = addOrLoginAdmin;
