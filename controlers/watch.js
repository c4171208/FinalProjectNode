import { WatchModel } from "../models/watch.js";
import mongoose from "mongoose";
import { watchValidator } from "../models/watch.js"
import multer from 'multer';
import path from 'path';

export const getAllWatches = async (req, res) => {
    let { search } = req.query;
    let perPage = req.query.perPage || 5; // הגבלה ל-5 מוצרים בברירת מחדל
    let page = req.query.page || 1;
    let reg = new RegExp(`^${search}$`);
    try {
        let filter = {};
        if (search) {
            filter.category = reg;
        }
        console.log(filter);
        let allWatches = await WatchModel.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json(allWatches);
    } catch (err) {
        return res.status(400).send({ type: "An error occurred while fetching products", message: err.message });
    }
};
export const getQuantityOfProducts = async (req, res) => {
    try {
        const numWatches = await WatchModel.countDocuments();
        res.json({ quantity: numWatches });
    } catch (err) {
        return res.status(500).send({ type: "Error", message: "An error occurred while fetching the number of watches" });
    }
};

export const getWatchById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(404).send({ type: "Invalid code", message: "The code sent is incorrect" })
        let watch = await WatchModel.findById(req.params.id)
        if (!watch)
            return res.status(404).send({
                type: "There is no product with such a code"
                , message: "Sorry, there is no watch with such a code"
            })
        return res.json(watch)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while fetching products by id", message: err.message })

    }
}
//old
// export const getWatchesByCategory = async (req, res) => {

//     let perPage = req.query.perPage || 5; // הגבלה ל-10 מוצרים בברירת מחדל
//     let page = req.query.page || 1;
//     let category = req.params.category;
//     try {
//         let watchesByThuscategory = await WatchModel.find({ category }) 
//         .skip((page - 1) * perPage)
//         .limit(perPage);

//         return res.json(watchesByThuscategory)
//     }
//     catch (err) {
//         return res.status(400).send({ type: "An error occurred while fetching products by catagory", message: err.message })

//     }
// }

export const getWatchesByCategory = async (req, res) => {
    let perPage = req.query.perPage || 3;

    let page = req.query.page || 1;
    console.log(page);
    let category = req.params.category;

    try {
        let watchesByThisCategory = await WatchModel.find({ category })
            .skip((page - 1) * perPage)
            .limit(perPage);

        let totalCount = await WatchModel.countDocuments({ category }); // ספירת כל הפריטים בקטגוריה זו

        let hasMore = (page * perPage) < totalCount; // בדיקה האם יש עוד פריטים להציג

        return res.json({ watches: watchesByThisCategory, hasMore: hasMore });
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while fetching products by category", message: err.message });
    }
}

export const deleteWatchById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(404).send({ type: "Invalid code", message: "The code sent is incorrect" })
        let deleted = await WatchModel.findByIdAndDelete(id)
        if (!deleted)
            return res.status(404).send({
                type: "There is no product with such a code"
                , message: "Sorry, there is no watch with such a code to delete"
            })
        return res.json(deleted)
    }
    catch (err) {
        return res.status(500).send({ type: "An error occurred while deleting a product", message: err.message })

    }
}

// פונקציה זו מעלה-תמונות מהשרת
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'staticFile/images/');
//     },
//     filename: function (req, file, cb) {

//         // Extract the original filename from the file object
//         const originalFilename = file.originalname;

//         cb(null, originalFilename);
//     }
// });

// const upload = multer({ storage: storage }).single('file');

// export const addWatch = async (req, res) => {

//     upload(req, res, async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Error uploading image.');
//         }
//         let originalFilename = req.file?.originalname; // השתמש בשילוב אופציונלי


//     let { price, description, model,category, IsLimitedEtition, collectionMichele,caseSize
//         ,movement,caseMaterial,strapSize ,silhouette ,TotalDiamondCarats, TotalDiamondCount
//         , urlImg,batteryType,uploadDate ,imgUrl} = req.body;
//         console.log( price, description, model,category);

//     let result = watchValidator(price, description, model,category, IsLimitedEtition, collectionMichele,caseSize
//         ,movement,caseMaterial,strapSize ,silhouette ,TotalDiamondCarats, TotalDiamondCount
//         , urlImg,batteryType,uploadDate )
//     if (result.error)
//         return res.status(404).send({ type: "the data is not ok", message: result.error.details[0].message })

//     try {
//         let sameWatch = await WatchModel.find({ model, price });
//         if (sameWatch.length > 0)
//             return res.status(409).send({ type: "conflict", message: "There is already a product with such a model and price" })
//         let newWatch = new WatchModel({
//             price, description, model,category, IsLimitedEtition, collectionMichele,caseSize
//             ,movement,caseMaterial,strapSize ,silhouette ,TotalDiamondCarats, TotalDiamondCount
//             ,batteryType,uploadDate ,imgUrl:originalFilename

//         });
//         await newWatch.save();
//         return res.json(newWatch)
//     }
//     catch (err) {
//         return res.status(550).send({ type: "An error occurred while in addition a product", message: err.message })

//     }
// }
// )
// }



export const addWatch = async (req, res) => {
    let { model, description, collectionMichele, material, caseSize, price, strapSize,
        category, silhouette, TotalDiamondCount, TotalDiamondCarats, urlImg, batteryType } = req.body;

    let result = watchValidator(req.body)
    if (result.error)
        return res.status(404).send({ type: "the data is not ok", message: result.error.details[0].message })
    try {
        let sameWatch = await WatchModel.find({ model, price });
        if (sameWatch.length > 0)
            return res.status(409).send({ type: "conflict", message: "There is already a product with such a model and price" })
        let newWatch = new WatchModel({
            model, description, collectionMichele, material, caseSize, price, strapSize,
            category, silhouette, TotalDiamondCount, TotalDiamondCarats, urlImg, batteryType
        });
        await newWatch.save();
        return res.json(newWatch)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while in addition a product", message: err.message })

    }

}


export const putWatchByID = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(404).send({ type: "Invalid code", message: "The code sent is incorrect" })
        let watchToUpdate = await WatchModel.findById(id)
        if (!watchToUpdate)
            return res.status(404).send({
                type: "There is no product with such a code"
                , message: "Sorry, there is no watch with such a code to upDate"
            });


        await WatchModel.findByIdAndUpdate(id, req.body)
        let watch = await WatchModel.findById(id)
        return res.json(watch)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while in upDate a product", message: err.message })

    }

}

//
