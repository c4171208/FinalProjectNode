
import mongoose from "mongoose";
import Joi from "joi";



const WatchSchema = mongoose.Schema({

    price: Number,
    description: String,
    model: String,
    category: String,
    IsLimitedEtition: { type: Boolean, default: false },
    collectionMichele: String,
    caseSize: String,// 36MM
    movement: String,//Chronograph
    caseMaterial: String,// Stainless Steel
    strapSize: Number,//גודל הרצועה
    silhouette: String,//צורת הלוחית
    TotalDiamondCount: Number,
    TotalDiamondCarats: Number,
    urlImg: String,
    batteryType: Number,
    uploadDate: { type: Date, default: new Date },
})



export const watchValidator = (_watch) => {
    const validCategory = ['Diamond', 'Tow Tone', 'Gold', 'Silver', 'Sport', 'Apple Accessories']
    const validCaseSize = ['S', 'M', 'L']
    const schema = Joi.object({

        price: Joi.number().min(0).required(),
        model: Joi.string().required(),
        movement: Joi.string(),
        description: Joi.string().required(),
        category: Joi.string().valid(...validCategory).required(),
        IsLimitedEtition: Joi.boolean().default(false),
        collectionMichele: Joi.string(),
        strapSize: Joi.number().min(14).max(20),
        caseSize: Joi.string().valid(...validCaseSize),
        silhouette: Joi.string(),
        caseMaterial: Joi.string(),
        TotalDiamondCount: Joi.number(),
        TotalDiamondCarats: Joi.number(),
        batteryType: Joi.number().default(371),
        urlImg: Joi.string(),
        uploadDate: Joi.date().default(new Date),
        imgUrl: Joi.string()
    });
    return schema.validate(_watch);
}

export const WatchModel = mongoose.model("watch", WatchSchema)