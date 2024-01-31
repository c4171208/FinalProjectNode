import express from "express";
import * as watchControlers from "../controlers/watch.js"
import {  auth, authAdmin } from "../middleWares/auth.js";
const router = express.Router();

router.get("/",watchControlers.getAllWatches )

router.get("/:id",watchControlers.getWatchById  )

router.delete("/:id",authAdmin,watchControlers.deleteWatchById)

router.post("/",authAdmin,watchControlers.addWatch)

router.put("/:id",authAdmin,watchControlers.putWatchByID)
// upDate
//איך מוסיפים יחודי לדברים
export default router;