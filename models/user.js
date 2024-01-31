import Joi from "joi";
import mongoose from "mongoose";


let userSchema = mongoose.Schema({
    tz: String,
    name: String,
    email: String,
    password: String,
    dateOfReg: { type: Date, default: new Date },
    role: { type: String, default: "user" }

})
export const User = mongoose.model("User", userSchema)

export const userValidatorForLogin = (_user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).required(),
        tz: Joi.string().min(9).pattern(/^[0-9]{9}$/),
        email: Joi.string().email(),
        dateOfReg: Joi.date(),
        role: Joi.string()

    });

    return schema.validate(_user);
}

export const userValidatorForSign = (_user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).required(),
        tz: Joi.string().min(9).pattern(/^[0-9]{9}$/).required(),
        email: Joi.string().email().required(),
        dateOfReg: Joi.date(),
        role: Joi.string()
    });

    return schema.validate(_user);
}