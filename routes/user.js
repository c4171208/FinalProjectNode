import express from "express";
import { addUser,login ,getAllUsers} from "../controlers/user.js";
import { authAdmin } from "../middleWares/auth.js";

const router = express.Router();

router.post("/",addUser )
router.post("/login",login )
router.get("/",authAdmin,getAllUsers )

export default router;