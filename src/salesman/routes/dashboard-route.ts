import express from "express"
import { getPaymentSummaryByDate } from "../controllers/dashboard-controller"
const router = express.Router()

router.get("/get-dashboard-data/:date", getPaymentSummaryByDate)


export default router