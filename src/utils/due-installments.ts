import cron from "node-cron";
import {SavingPlan} from "../users/models/saving-plan-model"; // adjust import path

cron.schedule("0 0 * * *", async () => {                                  //update every 5 minute */5 * * * *
  console.log(" Checking pending installments...");

  const plans = await SavingPlan.find({ planStatus: "active" });

  for (const plan of plans) {
    let updated = false;

    plan.installments = plan.installments.map((inst) => {
      const hasDueDate = inst.dueDate && inst.dueDate.to;
      const isPending = inst.status?.trim().toLowerCase() === "pending";
      const isDue = hasDueDate && new Date(inst.dueDate.to) < new Date();

      if (isPending && isDue) {
        inst.status = "due";
        updated = true;
      }

      return inst;
    });

    if (updated) {
      await plan.save();
    }
  }

  //console.log(" Due installments updated.");
});

