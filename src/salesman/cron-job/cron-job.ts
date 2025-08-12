
import cron from "node-cron";
import { Invoice } from "../models/invoice-model";
import { CustomOrder } from "../models/custom-order-model";
import { RepairingInvoice } from "../models/repairing-invoice-model";
import { Dashboard } from "../models/dashboard-model";

export const deleteRecordsInTwoDaysCronJob = ()=>{
    cron.schedule("* * * * *", async ()=>{
      try {
              // Step 1: Get IST time now
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
          twoDaysAgo.setHours(0, 0, 0, 0);
          
            
          const [
              deletedInvoice,
              deletedCustomOrder,
              deletedRepairingInvoice,
              deletedDashboardRecords,] = await Promise.all([

              Invoice.deleteMany({ createdAt: { $lt: twoDaysAgo } }),
              CustomOrder.deleteMany({ createdAt: { $lt: twoDaysAgo } }),
              RepairingInvoice.deleteMany({ createdAt: { $lt: twoDaysAgo } }),
              Dashboard.deleteMany({ createdAt: { $lt: twoDaysAgo } }),
            ]);

          console.log(`Deleted Invoice ${deletedInvoice.deletedCount}`)
          console.log(`Deleted Custom Order ${deletedCustomOrder.deletedCount}`)
          console.log(`Deleted dashboard ${deletedDashboardRecords.deletedCount}`)
          console.log(`Deleted repairing invoice ${deletedRepairingInvoice.deletedCount}`)
        } catch (error) {
			console.error("Error while deleting two days old records:", error);
		}
    })

}


