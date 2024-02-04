import { Order, orderValidator } from "../models/order.js";
import { watchValidator } from "../models/watch.js"
import { WatchModel } from "../models/watch.js";
import jwt from "jsonwebtoken";


import mongoose from "mongoose";



export const addOrder = async (req, res) => {
    const { numOrder, products, turnOn, orderDate } = req.body;
    const valid = orderValidator(req.body);

    if (valid.error) {
        return res.status(404).send({
            type: "the data is not ok",
            message: valid.error.details[0].message,
        });
    }

    try {
        const sameOrder = await Order.findOne({ numOrder });

        if (sameOrder) {
            return res
                .status(409)
                .send({
                    type: "conflict",
                    message: "There is already an order with such a numOrder",
                });
        }

        // Check if products array is not empty
        if (products.length === 0) {
            return res
                .status(404)
                .send({
                    type: "bad request",
                    message: "The products array cannot be empty",
                });
        }

        // Validation for each product in the products array
        for (const productIndex of products) {
            const product = await WatchModel.findOne({ model: productIndex.model });
            if (!product) {
                return res
                    .status(404)
                    .send({
                        type: "bad request",
                        message: "One of the product is not a product",
                    });
            }
            //למה זה מכניס את ה ID ולא את כל השם

        }
        console.log(req.user);
        // Now you can create the new order
        const newOrder = await new Order({
            numOrder,
            products,
            turnOn,
            orderDate,
            //שיניתי לנקודה _ID
            ordering: req.user._id
        });

        await newOrder.save();
        return res.json(newOrder);
    } catch (err) {
        return res
            .status(400)
            .send({
                type: " `An error occurred while adding an order",
                message: err.message,
            });
    }
};


// export const addOrder=async (req,res)=>{
// const {numOrder,products,turnOn,orderDate}=req.body;
// let valid=orderValidator(req.body);
// if(valid.error)
//   return res.status(404).send({type:"the data is not ok",message:valid.error.details[0].message})
// ///להוסיף את הID של המוצרים בצורה ידנית וכן לעבור על כל המוצרים ולבדוק שיש אכן מוצר כזה
//   try {
//     let sameOrder = await Order.findOne({numOrder})

//     if (sameOrder) 
//         return res.status(409).send({ type: "conflict", message: "There is already a order with such a numOrder" })

//     let newOrder=await new Order({numOrder,products,turnOn,orderDate});

//     await newOrder.save();
//     return res.send(newOrder)

// }
// catch(err){
//     return res.status(400).send({ type: "An error occurred while in addition a order", message: err.message })

// }
// }


export const deleteOrder = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(404).send({ type: "Invalid code", message: "The code sent is incorrect" })
        let deleted = await Order.findByIdAndDelete(id)
        if (!deleted)
            return res.status(404).send({
                type: "There is no order with such a code"
                , message: "Sorry, there is no order with such a code to delete"
            })
        return res.json(deleted)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while deleting a order", message: err.message })

    }
}

export const getAllOrders = async (req, res) => {
    try {
        let orders=await Order.find();
        return res.json(orders)

    } catch (err) {
        return res.status(400).send({ type: "An error occurred while get  all orders", message: err.message })
 
    }
}


export const getAllOrdersByToken = async (req, res) => {
    let token = req.headers["my-token"];
    if (!token)
        return res.status(404).json({ type: "not authorized", message: "user not authorized" });
    try {
        let person = jwt.verify(token, process.env.JWT_SECRET)
        let id1 = person._id;
        console.log(id1);
        let orders = await Order.find({ ordering: id1 })

        return res.json(orders)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while get all orders for you", message: err.message })

    }
}
export const upDateOrder = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(404).send({ type: "Invalid code", message: "The code sent is incorrect" })
        const orderToUpDate = await Order.findById(id);
        if (!orderToUpDate)
            return res.status(404).send({ type: "NOT FOUND!!", message: "Sorry, there is no such product to update" })
        await Order.findByIdAndUpdate(id, { turnOn: true })
        let order = await Order.findById(id)
        return res.json(order)
    }

    catch (err) {
        return res.status(400).send({ type: "An error occurred while upDate the order by the admin", message: err.message })

    }



}


