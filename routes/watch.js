import express from "express";
import * as watchControlers from "../controlers/watch.js"
import { auth, authAdmin } from "../middleWares/auth.js";
const router = express.Router();

router.get("/", watchControlers.getAllWatches)
router.get("/qutiy", watchControlers.getQuantityOfProducts)
router.get("/:id", watchControlers.getWatchById)
router.get("/catagory/:category", watchControlers.getWatchesByCategory)
router.delete("/:id", authAdmin, watchControlers.deleteWatchById)
router.post("/", authAdmin, watchControlers.addWatch)

router.put("/:id", watchControlers.putWatchByID)

export default router;