const User = require("../models/users");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

      res.status(200).send({ message: "User logged in", token });
    } else {
      return next(new CustomError("Invalid email or password", 401));
    }
  } catch (error) {
    console.log(error);
    next(new CustomError("Internal server error", 500));
  }
};

// exports.refreshToken=async (req, res) => {
//     const { token } = req.body;
//     if (!token) return next(new CustomError('No token provided ', 401));

//     jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN, (err, user) => {
//         if (err) return next(new CustomError('Invalid or expired refresh token ', 403));

//         const newAccessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_ACCESS_TOKEN, { expiresIn: '15m' });
//         res.status(200).send({
//             massage:"New access token has been issued successfully.",
//              accessToken: newAccessToken
//             });
//     })
// }

exports.updateProfileUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: req.name, image: req.user.image },
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
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    const isMatched = await bcrypt.compare(currentPassword, user.password);

    if (isMatched) {
      newPassword = await bcrypt.hash(newPassword, 10);
    } else {
      return next(new CustomError("Current password is wrong", 401));
    }
    console.log(user, newPassword);

    const userUpated = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });

    res.status(200).send({ message: "password updated successfully", user });
  } catch (error) {
    console.log(error);

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
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    const mailOptions = {
      from: "Itians <amrkataria1234@gmail.com>",
      to: user.email,
      subject: "Password Reset",
      text: `this is reset token ${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(new CustomError("error sending email", 404));
      }
      res.status(200).send({ message: "Token sended" });
    });

    res.status(200).send({ message: "Password reset email sent." });

    await user.save();
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

exports.restPassword = async (req, res, next) => {
  const { token, email, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return next(new CustomError("Passwords do not match.", 400));
    }

    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    next(new CustomError("Internal server error.", 500));
  }
};
