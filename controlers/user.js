import { User, userValidatorForLogin, userValidatorForSign } from "../models/user.js";
import { hash, compare } from "bcrypt"
import { generateToken } from "./generateToken.js";

export const addUser = async (req, res) => {

    let { name, password, tz, email,role,dateOfReg } = req.body;
    let validate = userValidatorForSign(req.body);

    if (validate.error)
        return res.status(404).json({ type: "not valid data ", message: validate.error.details[0].message });

    try {
        let sameUser = await User.findOne({ $or: [{ name }, { tz }, { email }] })
        if (sameUser) {
            return res.status(409).send({ type: "conflict", message: "There is already a user with such a name and tz or email" })
        }

        let hashPassword = await hash(password, 10)
        let newUser = new User({ name, tz, password: hashPassword, email,role,dateOfReg })
        await newUser.save();
        let id = newUser._id;
        let token = generateToken(newUser)
        console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111");
        return res.json({ _id: id, email, role: newUser.role, dateOfReg: newUser.dateOfReg, name, tz, token });
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while in addition a user", message: err.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find({}, "-password");
        res.json(users)
    }
    catch (err) {
        return res.status(400).send({ type: "An error occurred while in get all users", message: err.message })

    }
}

export const login = async (req, res) => {

    let validate = userValidatorForLogin(req.body);
    let { name, password } = req.body;

    if (validate.error)
        return res.status(404).json({ type: "not valid in login", message: validate.error.details[0].message })
    try {
        let user = await User.findOne({ name })
        if (!user || !await compare(password, user.password))
            return res.status(400).send({ type: "please sigh in!", message: err.message })
        let token = generateToken(user)

        return res.json({ _id: user._id, email:user.email, role: user.role, dateOfReg: user.dateOfReg, name, tz:user.tz, token });
    }
    catch (err) {

        return res.status(400).send({ type: "An error occurred while in login", message: err.message })
    }

}
