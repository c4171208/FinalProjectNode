
import mongoose from "mongoose";
import Joi from "joi";


const WatchSchema=mongoose.Schema({
    //איך עושים כמו  ENUM
    model:String,
    description:String,
    collectionMichele:String,
    material:[String],//מערך?
    caseSize:String,
    price:Number,
    strapSize:Number,//גודל הרצועה
    category:String,
    silhouette:String,//צורת הלוחית
    TotalDiamondCount:Number,
    TotalDiamondCarats:Number,
    urlImg:String
})



export const watchValidator=(_watch)=>{
    const schema=Joi.object({
        model:Joi.string().required(),
        price:Joi.number().min(0).required(),
        strapSize:Joi.number().min(14).max(20),
        caseSize:Joi.string(),
        silhouette:Joi.string(),
        material:Joi.string(),
        collectionMichele:Joi.string(),
        category:Joi.string(),
        TotalDiamondCount:Joi.number(),
        TotalDiamondCarats:Joi.number(),
        description:Joi.string(),
        urlImg:Joi.string()
    });
    return schema.validate(_watch );
}

export  const  WatchModel=mongoose.model("watch",WatchSchema)