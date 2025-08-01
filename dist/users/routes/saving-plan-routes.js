"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saving_plan_controller_1 = require("../controllers/saving-plan-controller");
const router = express_1.default.Router();
router.post("/create", saving_plan_controller_1.createSavingPlan);
exports.default = router;
