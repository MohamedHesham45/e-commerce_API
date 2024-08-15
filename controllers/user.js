const User = require("../models/users");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtSign = util.promisify(jwt.sign);
const CustomError = require('../utils/customError');

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("Email is already used.", 409));
        }


        const user = new User({ name, email, password });
        await user.save();

        res.status(201).send({ message: "User created", user });
    } catch (error) {
        next(new CustomError("Internal server error.", 500));
    }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return next(new CustomError('Invalid email or password', 401));
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (isMatched) {
          const token = await jwtSign({ userId: user._id }, process.env.JWT_SECRET_ACCESS_TOKEN, {
              expiresIn: '30d',
          });
     
          res.status(200).send({ message: 'User logged in', token });
      } else {
          return next(new CustomError('Invalid email or password', 401));
      }
  } catch (error) {
    console.log(error);
      next(new CustomError('Internal server error', 500));
  }
};


exports.updateProfileUser = async (req,res,next)=>{

}

exports.changeUserPassword= async(req,res,next)=>{

}
exports.forgetPassword= async(req,res,next)=>{
    //sendGrid
}
exports.restPassword= async(req,res,next)=>{

}





