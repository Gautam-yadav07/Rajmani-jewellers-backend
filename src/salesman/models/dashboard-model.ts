import mongoose from "mongoose"
import { IDashboard } from "../../all-types/all-interface";

const dashboardSchema = new mongoose.Schema<IDashboard>({
  date: { type: Date, required: true,default:Date.now },

  totalSale: {
    cash: { type: Number, default: 0 },
    upi: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  totalRepair: {
    cash: { type: Number, default: 0 },
    upi: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Dashboard = mongoose.model("Dashboard", dashboardSchema)