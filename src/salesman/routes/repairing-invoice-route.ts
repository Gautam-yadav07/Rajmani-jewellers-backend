import express from "express"
import { createRepairingInvoice, deleteRepairingInvoice, getAllRepairingInvoice, getRepairingInvoiceById, getRepairingInvoiceByName, getRepairingInvoiceByProductName, updateRepairingInvoice } from "../controllers/repairing-invoice-controller"
const router = express.Router()


router.post("/create-repairing-invoice", createRepairingInvoice)
router.get("/get-all-repairing-invoice", getAllRepairingInvoice)
router.get("/get-repairing-invoice-by-id/:id", getRepairingInvoiceById);
router.get("/get-repairing-invoice-by-name/:name", getRepairingInvoiceByName);
router.get("/get-repairing-invoice-by-product-name/:productname", getRepairingInvoiceByProductName);
router.patch("/update-repairing-invoice/:id",updateRepairingInvoice)
router.post("/delete-repairing-invoice/:id", deleteRepairingInvoice)






export default router