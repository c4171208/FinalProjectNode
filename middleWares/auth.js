import jwt from "jsonwebtoken"
import { Order } from "../models/order.js";
import mongoose from "mongoose";


export const auth = async (req, res, next) => {
   let token = req.headers["my-token"];
   if (!token)
      return res.status(401).json({ type: "not authorized", message: "user not authorized" });
   try {
      let person = jwt.verify(token, process.env.JWT_SECRET)
      req.user = person;
      next();
   }
   catch (err) {
      return res.status(400).json({ type: "An error occurred in the middle ware from auth ", message: err.message });

   }

}

export const authAcoordingOrder = async (req, res, next) => {
   let token = req.headers["my-token"];
   if (!token)
      return res.status(401).json({ type: "not authorized", message: "user not authorized" });
   try {
      let person = jwt.verify(token, process.env.JWT_SECRET)

      let { id } = req.params;
      if (!mongoose.isValidObjectId(id))
         return res.status(400).send({ type: "Invalid code", message: "The code sent is incorrect" })
      let order = await Order.findById(id)

      if (!order)
         return res.status(401).json({ type: "not found a order with this id", message: "not found a order with this id" });
      if ((person._id == order.ordering || person.role == "ADMIN") && !order.turnOn) {
         next()

      }
      else if ((person._id == order.ordering || person.role == "ADMIN") && order.turnOn) {
         return res.status(400).json({ type: "The current order cannot be deleted", message: "The order has started away" });

      }
      else {
         return res.status(401).json({ type: "Error!!!", message: "You do not have permission to delete an order " });
      }
   }
   catch (err) {
      return res.status(400).json({ type: "An error occurred in the middle ware from authAcoordingOrder ", message: err.message });

   }

}



export const authAdmin = async (req, res, next) => {
   let token = req.headers["my-token"];
   if (!token)
      return res.status(401).json({ type: "not authorized", message: "you are not authorized" });
   try {
      let person = jwt.verify(token, process.env.JWT_SECRET)
      req.user = person;
      console.log("peson=> " + person.role);
      if (person.role === "ADMIN") {
         next();

      }
      else {

         return res.status(403).json({ type: "not allowed in the middle ware from authAdmin", message: "you are not a admin" });
      }
   }
   catch (err) {
      return res.status(400).json({ type: "An error occurred ", message: err.message });

   }

}
