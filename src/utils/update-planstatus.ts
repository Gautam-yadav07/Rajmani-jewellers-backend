


import { CronJob } from "cron";
import { SavingPlan } from "../users/models/saving-plan-model"


export const checkAndUpdatePlansCron = new CronJob(
    '0 0 * * *', async()=>{
        try {
    const plans = await SavingPlan.find({ planStatus: "active" });

    for (const plan of plans) {
      const allPaid =
        plan.installments.length === 11 &&
        plan.installments.every((i) => i.status === "paid");

      if (allPaid && plan.endedOn) {
        const now = new Date();
        const endedOnDate = new Date(plan.endedOn);

        if (now >= endedOnDate) {
          plan.planStatus = "past";

          //  Set redeem status to pending
          plan.redeemedStatus = "pending";
          

          await plan.save();
          //console.log(`Plan ${plan._id} moved to 'past' & pending`);
        }
      }
    }
  } catch (err) {
    console.error("Cron Error:", err);
  }

    }

)

