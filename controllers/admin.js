const User = require("../models/users");

exports.creatAdmin = async(req,res,next)=>{
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("Email is already used.", 409));
        }


        const user = new User({ name, email, password,role:"admin" });
        await user.save();

        res.status(201).send({ message: "User created", user });
    } catch (error) {
        next(new CustomError("Internal server error.", 500));
    }
}

// exports.confirmProduct= async(req,res,next)=>{


// }
// exports.deleteProduct= async(req,res,next)=>{

// }
// exports.updateProduct= async(req,res,next)=>{

// }
