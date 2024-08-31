const User = require("../models/users");
const Product = require("../models/product");
const Category = require("../models/category");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtSign = util.promisify(jwt.sign);
const CustomError = require("../utils/customError");
const transporter = require("../utils/nodemialer");

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
      return next(new CustomError("Invalid email or password", 401));
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const token = await jwtSign(
        { userId: user._id },
        process.env.JWT_SECRET_ACCESS_TOKEN,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).send({ message: "User logged in", token, user });
    } else {
      return next(new CustomError("Invalid email or password", 401));
    }
  } catch (error) {
    console.log(error);
    next(new CustomError("Internal server error", 500));
  }
};
exports.updateProfileUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: req.body.name, image: req.body.image },
      { new: true }
    );
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    res.status(200).send({ message: "Profile updated successfully", user });
  } catch (error) {
    next(new CustomError("Internal server error.", 500));
  }
};

exports.changeUserPassword = async (req, res, next) => {
  let { currentPassword, newPassword } = req.body;

  try {
    const user = req.user;

    const isMatched = await bcrypt.compare(currentPassword, user.password);

    if (isMatched) {
      user.password = newPassword;
    } else {
      return next(new CustomError("Current password is wrong", 401));
    }

    await user.save()

    res.status(200).send({ message: "password updated successfully", user });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    const resetToken = crypto.randomBytes(3).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;
    user.resetToken = resetToken
    user.resetTokenExpiration = resetTokenExpiration

    await user.save();

    const mailOptions = {
      from: `Itians <${process.env.NODEMAILER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset",
      text: `This is your reset token: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: "Password reset email sent." });

  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};



exports.resetPassword = async (req, res, next) => {
  const { token, email, newPassword } = req.body;

  try {

    console.log(req.body);
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    next(new CustomError("Internal server error.", 500));
  }
};


exports.updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    if (isNaN(quantity)) {
      return next(new CustomError("Invalid quantity", 400));
    }

    const user = await User.findById(userId).populate('cart.product');


    const cartItem = user.cart.find(item => item.product.id.toString() === productId);

    if (cartItem) {
      cartItem.quantity += quantity;

      if (cartItem.quantity <= 0) {
        user.cart = user.cart.filter(item => item.product.id.toString() !== productId);
      }
    } else {
      const product = await Product.findById(productId).populate('categoryID', 'name');
      if (!product) {
        return next(new CustomError("Product not found", 404));
      }
      if (quantity > 0) {
        user.cart.push({ product, quantity });
      } else {
        return next(new CustomError("Cannot add product with negative or zero quantity.", 400));
      }
    }

    await user.save();

    res.status(200).send({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};



exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const user = await User.findById(userId).populate('cart.product');


    const isInCart = user.cart.find(item => item.product.id.toString() === productId);

    if (isInCart) {
      user.cart = user.cart.filter(item => item.product.id.toString() !== productId);
      await user.save();
      return res.status(200).send({ message: "Product removed from cart", cart: user.cart });
    } else {
      return next(new CustomError("Product not found in cart", 404));
    }
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};


exports.toggleFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const user = await User.findById(userId).populate('favourite');

    const isAlreadyFavourite = user.favourite.some(item => item._id.toString() === productId);

    if (isAlreadyFavourite) {
      user.favourite = user.favourite.filter(item => item._id.toString() !== productId);
    } else {
      const product = await Product.findById(productId).populate('categoryID', 'name');

      if (!product) {
        return next(new CustomError("Product not found", 404));
      }

      user.favourite.push(product);
    }

    await user.save();

    res.status(200).send({
      message: isAlreadyFavourite
        ? "Product removed from favourites"
        : "Product added to favourites",
      favourites: user.favourite
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};




exports.getUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: 'cart.product',
        model: 'Product'
      });
    return res.status(200).send({ message: "User Cart", cart: user.cart });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getUserFavourites = async (req, res, next) => {
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

exports.addToCartWithoutLogin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = req.body.cartItems; 

    if (!Array.isArray(cartItems)) {
      return next(new CustomError("Invalid cart data", 400));
    }

    for (let item of cartItems) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return next(new CustomError("Invalid productId or quantity", 400)); 
      }
    }

    const user = await User.findById(userId).populate('cart.product');
   

    const incomingProductIds = new Set(cartItems.map(item => item.productId.toString()));

    user.cart = user.cart.filter(cartItem => {
      const productId = cartItem.product.id.toString();
      if (!incomingProductIds.has(productId)) {
        return false; 
      }
      return true; 
    });

    for (let item of cartItems) {
      const product = await Product.findById(item.productId).populate('categoryID', 'name');
      if (!product) {
        return next(new CustomError(`Product with id ${item.productId} not found`, 404));
      }

      const existingCartItem = user.cart.find(cartItem => cartItem.product.id.toString() === item.productId);

      if (existingCartItem) {
        existingCartItem.quantity = item.quantity;

        
      } else {
        if (item.quantity > 0) {
          user.cart.push({ product, quantity: item.quantity });
        } else {
          return next(new CustomError("Cannot add product with negative or zero quantity.", 400));
        }
      }
    }

    await user.save();

    res.status(200).send({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};