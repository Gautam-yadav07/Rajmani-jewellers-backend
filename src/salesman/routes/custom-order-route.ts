import express from 'express';
import { createCustomOrder, deleteCustomOrder, getAllCustomOrders,  getCustomeOrderByProductName,  getCustomOrderById, getCustomOrderByName, updateCustomeOrder } from '../controllers/custom-order-controller';
const router = express.Router()

router.post("/create-custom-order", createCustomOrder)
router.get("/get-all-custom-order", getAllCustomOrders)
router.get("/get-custom-order-by-name/:name", getCustomOrderByName)
router.get("/get-custom-order-by-product-name/:productname", getCustomeOrderByProductName)
router.put("/update-custom-order/:id", updateCustomeOrder)
router.get("/get-custom-order-by-id/:orderId", getCustomOrderById)
router.delete("/delete-custom-order/:orderId", deleteCustomOrder)

export default router