import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import watchRouter from "./routes/watch.js"
import userRouter from "./routes/user.js"
import orderRouter from "./routes/order.js"

import { middleWare } from "./middleWares/middleWare.js";

config();

const app = express();

const mongoDB = process.env.DB_CONNECTION;

//התחברות למסד נתונים
mongoose.connect(`${mongoDB}`).then(suc => {
    console.log(`mongo DB conected ${suc.connection.host}`);
}).catch(err => {
    console.log(err);
    console.log(`canot conect mondo DB`);
    process.exit(1);

})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*", methods: "*" }))
app.use(morgan("common"))//מדפיס כל בקשה שמגיעה לשרת בפורמט מסוים לטרמינל
app.use("/api/watch", watchRouter)
app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)
app.use(middleWare)
let port = process.env.PORT || 3500;
app.listen(port, () => { console.log(`app is listening on port ${port}`); })



