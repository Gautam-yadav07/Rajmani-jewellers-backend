import express from "express"
import { getPaymentSummaryByDate } from "../controllers/dashboard-controller"
const router = express.Router()

router.get("/", getPaymentSummaryByDate)


export default router