

// import { CronJob } from "cron";
// import { SavingPlan } from "../users/models/saving-plan-model"; // adjust path as needed

// // Run this cron daily at midnight (India time)
// export const checkAndUpdatePlansCron = new CronJob(
//   '0 0 * * *', // every midnight
//   async () => {
//     try {
//       console.log(" Cron started...");

//       const activePlans = await SavingPlan.find({ planStatus: "active" });

//       for (const plan of activePlans) {
//         const allPaid = plan.installments.length === 11 && plan.installments.every(i => i.status === "paid");

//         const isEnded = plan.endedOn && new Date(plan.endedOn) <= new Date();

    

//         if (allPaid && isEnded) {
//           plan.planStatus = "past";
//           await plan.save();
//           //console.log(`Plan ${plan._id} marked as 'past'`);
//         } else {
//           //console.log(`Plan ${plan._id} NOT eligible for update.`);
//         }
//       }

//       //console.log("Cron job completed.\n");
//     } catch (error) {
//       console.error("Error in updating status:", error);
//     }
//   },

// );


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

