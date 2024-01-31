
import mongoose from "mongoose";
import Joi from "joi";

const MiniWatchSchema=mongoose.Schema({
    model:String,
    price:Number,
    count:{type:Number,default:1}
})

export const   MiniWatchValidator=(_miniWatch)=>{
    const schema=Joi.object({
        model:Joi.string().required(),
        price:Joi.number(),
        count:Joi.required()
    })
    return schema.validate(_miniWatch);
}


const OrderSchema=mongoose.Schema({
    numOrder:String,
    orderDate:{type: Date,default:new Date },
    turnOn:{type: Boolean,default:false },//יצאה לדרך?
    products:[{type: MiniWatchSchema }],
    ordering:String//מזמין
})

export const Order=mongoose.model("Order",OrderSchema)

export const orderValidator=(_order)=>{
    const schema=Joi.object({
    numOrder:Joi.string(),
    orderDate:Joi.date(),
    // turnOn:Joi.boolean().required(),
    products:Joi.required(),

    });
    return schema.validate(_order );
}

