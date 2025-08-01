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
exports.getAllSavingPlans = exports.createSavingPlan = void 0;
const saving_plan_model_1 = require("../models/saving-plan-model");
const createSavingPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { savingPlanName, monthlyInstallment, from, } = req.body;
        if (!savingPlanName || !monthlyInstallment || !from) {
            res.status(404).json({
                success: false,
                message: "All the Fields are Required"
            });
        }
        const fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid 'from' date format",
            });
        }
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 7);
        const tenure = 12;
        const totalPayment = monthlyInstallment * (tenure - 1);
        const specialBenifit = monthlyInstallment * 1;
        const totalJewelleryWorth = totalPayment + specialBenifit;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() + 7);
        // const userId = 1
        const newPlane = new saving_plan_model_1.SavingPlan({
            // userId,
            savingPlanName,
            monthlyInstallment,
            tenure,
            totalPayment,
            specialBenifit,
            totalJewelleryWorth,
            from: fromDate,
            to: toDate,
        });
        yield newPlane.save();
        res.status(201).json({
            success: true,
            message: "Plan created succesfully."
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.createSavingPlan = createSavingPlan;
const getAllSavingPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const query = userId ? { userId } : {};
        const plans = yield saving_plan_model_1.SavingPlan.find(query).populate("userId", "userName phoneNumber");
        res.status(200).json({ success: true, data: plans });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching saving plans", error });
    }
});
exports.getAllSavingPlans = getAllSavingPlans;
