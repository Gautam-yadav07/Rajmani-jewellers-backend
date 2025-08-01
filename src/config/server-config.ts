import express from "express"
import cors from "cors";
import { connectDB } from "./db-config";
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import "../utils/due-installments"; // update installment status paid to due

import { checkAndUpdatePlansCron } from "../utils/update-planstatus"; // //update plan status active to past
checkAndUpdatePlansCron.start();


config()
const url = process.env.FRONTEND_URL

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(cors()); // allows all origins


// app.use(cors({
//     origin: url
// }))
connectDB()

export default app