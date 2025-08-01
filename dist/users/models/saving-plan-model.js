"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingPlan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const savingPlanSchema = new mongoose_1.default.Schema({
    savingPlanName: {
        type: String,
        required: true
    },
    monthlyInstallment: {
        type: Number,
        required: true
    },
    tenure: Number,
    totalPayment: Number,
    specialBenifit: Number,
    totalJewelleryWorth: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    from: Date,
    to: Date,
});
exports.SavingPlan = mongoose_1.default.model("SavingPlan", savingPlanSchema);
