const User = require('../models/users');
const jwt = require('jsonwebtoken');
const util = require('util');
const CustomError = require('../utils/customError');
const { log } = require('console');
require('dotenv').config(); 
const jwtVerify = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token || !token.startsWith('Bearer ')) {
      throw new CustomError('No token provided or token format is incorrect', 401);
    }

    const tokenValue = token.split(' ')[1];  
    const payload = await jwtVerify(tokenValue, process.env.JWT_SECRET_ACCESS_TOKEN);
    const user = await User.findById(payload.userId);
    if (!payload.userId || !payload.exp) {
      throw new CustomError('Invalid token payload', 401);
    }
    if (!user) {
      throw new CustomError('User not found', 401); 
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new CustomError('Token expired', 401));
    } else if (err.name === 'JsonWebTokenError') {
      return next(new CustomError('Invalid token', 401));
    }
    console.error('Authentication error:', err); 
    return next(new CustomError('Internal server error', 500));
  }
};
