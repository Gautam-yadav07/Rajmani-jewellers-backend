import express from 'express'
import { activatePlan,  createSavingPlan, deleteSavingPlan, getActivePlans,  getAllSavingPlans, getSavingPlanById, redeemPlan, updateSavingPlan } from '../controllers/saving-plan-controller'
import { auth } from '../../middlewares/auth'
const router = express.Router()

router.post("/create", createSavingPlan)

router.post("/activate",activatePlan)

router.get("/active", getActivePlans)

router.get("/",  getAllSavingPlans)



router.post("/:id/redeem", auth, redeemPlan)
router.get("/:planId", getSavingPlanById);





router.put("/:id", updateSavingPlan);
router.delete("/:id", deleteSavingPlan);

  


export default router