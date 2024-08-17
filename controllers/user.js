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
            return next(new CustomError("Email is already in use.", 409));
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new CustomError('Invalid email or password', 401));
        }
        const isMatched = bcrypt.compare(password, user.password);
        if (isMatched) {
            const token = await jwtSign({ userId: user.id }, process.env.JWT_SECRET_ACCESS_TOKEN, {
                expiresIn: '30d',
            });

            res.status(200).send({ message: 'User logged in successfully', token });
        } else {
            return next(new CustomError('Invalid email or password', 401));
        }
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

exports.updateCartQuantity = async (req, res, next) => {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity) || 1;

        if (isNaN(quantity)) {
            return next(new CustomError("Invalid quantity", 400));
        }

        const cartItem = user.cart.find(item => item.productId.toString() === productId);

        if (cartItem) {
            cartItem.quantity += quantity;

            if (cartItem.quantity <= 0) {
                user.cart = user.cart.filter(item => item.productId.toString() !== productId);
                return res.status(200).send({ message: "Product removed from cart", cart: user.cart });
            }
        } else {
            if (quantity > 0) {
                user.cart.push({ productId, quantity });
            } else {
                return next(new CustomError("Invalid operation. Cannot add a product with negative or zero quantity.", 400));
            }
        }

        await user.save();
        res.status(200).send({ message: "Cart updated successfully", cart: user.cart });

    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.productId;

        const isInCart = user.cart.some(item => item.productId.toString() === productId);

        if (isInCart) {
            user.cart = user.cart.filter(item => item.productId.toString() !== productId);
            await user.save();
            return res.status(200).send({ message: "Product removed from cart", cart: user.cart });
        } else {
            return next(new CustomError("Product not found in cart", 404));
        }
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};

exports.toggleFavourite = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.productId;

        const isAlreadyFavourite = user.favourite.some(item => item.toString() === productId);

        if (isAlreadyFavourite) {
            user.favourite = user.favourite.filter(item => item.toString() !== productId);
            await user.save();
            return res.status(200).send({ message: "Product removed from favourites", favourites: user.favourite });
        } else {
            user.favourite.push(productId);
            await user.save();
            return res.status(200).send({ message: "Product added to favourites", favourites: user.favourite });
        }
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};


exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate({
                path: 'cart.productId',
                model: 'Product'
            });
        return res.status(200).send({ message: "User Cart", cart: user.cart });
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};

exports.getUserFavourites = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate({
                path: 'favourite',
                model: 'Product'
            });

        return res.status(200).send({ message: "User Favourite", favourite: user.favourite });
    } catch (error) {
        return next(new CustomError(error.message, 500));
    }
};



