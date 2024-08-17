const User = require("../models/users");
const CustomError = require('../utils/customError');

exports.creatAdmin = async(req,res,next)=>{
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("Email is already in use.", 409));
        }
        const user = new User({ name, email, password,role:"admin" });
        await user.save();
        res.status(201).send({ message: "Admin user created successfully", user });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
}

