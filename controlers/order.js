import { Order, orderValidator } from "../models/order.js";
import { WatchModel } from "../models/watch.js";
import jwt from "jsonwebtoken";

import mongoose from "mongoose";

export const addOrder = async (req, res) => {
    const { products, turnOn, orderDate } = req.body;
    const valid = orderValidator(req.body);

    if (valid.error) {
        return res.status(404).send({
            type: "the data is not ok",
            message: valid.error.details[0].message,
        });
    }

    try {
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
        }
       
        // Now you can create the new order
        const newOrder = await new Order({
            products,
            turnOn,
            orderDate,
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
        let orders = await Order.find();
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


