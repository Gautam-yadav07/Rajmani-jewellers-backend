import express from "express"
import { giftGold } from "../controllers/gifted-gold-controller"
import { auth } from "../../middlewares/auth"
const router = express.Router()


// router.post("/", auth, giftGold )
router.post("/gold", auth, giftGold )


export default router