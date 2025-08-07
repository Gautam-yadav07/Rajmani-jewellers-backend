import express from 'express';
import { createInvoice, deleteInvoice, getAllInvoices, getInvoiceByBillNo, getInvoiceById, getInvoiceByName, getInvoiceByProductName, updateInvoice } from '../controllers/invoice-controller';
import { createCustomOrder } from '../controllers/custom-order-controller';
const router = express.Router()

router.post("/create-invoice", createInvoice)
router.get("/get-all-invoice", getAllInvoices)

router.get("/get-invoice-by-name", getInvoiceByName)
router.get("/get-invoice-by-product-name", getInvoiceByProductName)
router.get("/get-invoice-by-billno", getInvoiceByBillNo)
router.get("/get-invoice-by-id/:invoiceId", getInvoiceById)
router.post("/update-invoice/:id", updateInvoice)
router.post("/delete-invoice/:invoiceId", deleteInvoice)


export default router