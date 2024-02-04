import { WatchModel } from "../models/watch.js";
import mongoose from "mongoose";
import{watchValidator}from "../models/watch.js"
export const getAllWatches = async (req, res) => {
 
    let { search } = req.query;
    let perPage = req.query.perPage || 20;
    let page = req.query.page || 1;
    let reg = new RegExp(`${search}`)//הסתיים

    try {
        let filter = {};
        if (search) {
            filter.description = reg;
        }


        let allWatches = await WatchModel.find(filter)
            .skip((page - 1) * (perPage))
            .limit(perPage)

        res.json(allWatches)
    }
    catch (err) {
        return res.status(400).send({type:"An error occurred while fetching products",message:err.message})
    }
}

export const getWatchById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(404).send({type:"Invalid code",message:"The code sent is incorrect"})
        let watch = await WatchModel.findById(req.params.id)
        if (!watch)
            return res.status(404).send({type:"There is no product with such a code"
            ,message:"Sorry, there is no watch with such a code"})
        res.json(watch)
    }
    catch (err) {
        return res.status(400).send({type:"An error occurred while fetching products by id",message:err.message})

    }
}
export const deleteWatchById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
        return res.status(404).send({type:"Invalid code",message:"The code sent is incorrect"})
        let deleted = await WatchModel.findByIdAndDelete(id)
        if (!deleted)
            return res.status(404).send({type:"There is no product with such a code"
            ,message:"Sorry, there is no watch with such a code to delete"})
        return res.json(deleted)
    }
    catch (err) {
        return res.status(400).send({type:"An error occurred while deleting a product",message:err.message})

    }
}
export const addWatch = async (req, res) => {
    let {  model,description,collectionMichele, material,caseSize,price, strapSize,
        category, silhouette, TotalDiamondCount,TotalDiamondCarats,urlImg} = req.body;
       
    let result=watchValidator(req.body)
    if(result.error)
        return res.status(404).send({type:"the data is not ok",message:result.error.details[0].message})
    try {
        let sameWatch = await WatchModel.find({ model, price });
        if (sameWatch.length > 0)
            return res.status(409).send({type:"conflict",message:"There is already a product with such a model and price"})
        let newWatch = new WatchModel({  model,description,collectionMichele, material,caseSize,price, strapSize,
            category, silhouette, TotalDiamondCount,TotalDiamondCarats,urlImg});
        await newWatch.save();
        return res.json(newWatch)
    }
    catch (err) {
        return res.status(400).send({type:"An error occurred while in addition a product",message:err.message})

    }

}

export const putWatchByID = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
        return res.status(404).send({type:"Invalid code",message:"The code sent is incorrect"})
        let watchToUpdate = await WatchModel.findById(id)
        if(!watchToUpdate)
        return res.status(404).send({type:"There is no product with such a code"
        ,message:"Sorry, there is no watch with such a code to upDate"});
       

        await WatchModel.findByIdAndUpdate(id, req.body)
        let watch = await WatchModel.findById(id)
        return res.json(watch)
    }
    catch (err) {
        return res.status(400).send({type:"An error occurred while in upDate a product",message:err.message})

    }

}

