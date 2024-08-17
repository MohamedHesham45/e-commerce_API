const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const singleImageUpload = require("../middlewares/uploadSingleImage");
const {
  createUser,
  loginUser,
  updateProfile,
  changePassword,
  forgetPasswordUser,
  resetPasswordUser,
} = require("../utils/validation/user");
const validation = require("../middlewares/validateRequest");
const {
  signup,
  login,
  updateProfileUser,
  changeUserPassword,
  forgetPassword,
  restPassword,
} = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signup", validation(createUser), signup);
router.post("/login", validation(loginUser), login);
router.patch(
  "/updateProfile",
  auth,
  upload.single("image"),
  validation(updateProfile),
  singleImageUpload,
  updateProfileUser
);
router.patch(
  "/changePassword",
  auth,
  validation(changePassword),
  changeUserPassword
);
router.post("/forgetPassword", validation(forgetPasswordUser), forgetPassword);
router.post("/resetPassword", validation(resetPasswordUser), restPassword);

module.exports = router;
