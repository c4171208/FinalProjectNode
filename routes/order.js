import express from "express";
import { addOrder, deleteOrder, getAllOrders, getAllOrdersByToken, upDateOrder } from "../controlers/order.js"
import { auth, authAcoordingOrder, authAdmin } from "../middleWares/auth.js";
const router = express.Router();

router.get("/", getAllOrders)
router.get("/user", auth, getAllOrdersByToken)
router.post("/", auth, addOrder)
router.delete("/:id", authAcoordingOrder, deleteOrder)
router.put("/:id", authAdmin, upDateOrder)

export default router;