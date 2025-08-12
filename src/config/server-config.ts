import express from "express"
import cors from "cors";
import { connectDB } from "./db-config";
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import { deleteRecordsInTwoDaysCronJob,} from "../salesman/cron-job/cron-job";
deleteRecordsInTwoDaysCronJob()

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