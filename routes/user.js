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
  resetPassword,
  updateCartQuantity,
  removeFromCart,
  toggleFavourite,
  getUserCart,
  getUserFavourites,
  addToCartWithoutLogin
} = require("../controllers/user"); 
const auth = require("../middlewares/auth");

router.post("/signup", validation(createUser), signup);
router.post("/login", validation(loginUser), login);
router.patch(
  "/updateProfile",
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 }]),
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
router.post("/resetPassword", validation(resetPasswordUser), resetPassword);
router.post("/cart/:id",auth,updateCartQuantity)
router.post("/cart",auth,addToCartWithoutLogin)
router.get("/cart",auth,getUserCart)
router.delete("/cart/:id",auth,removeFromCart)
router.post("/favourite/:id",auth,toggleFavourite)
router.get("/favourite",auth,getUserFavourites)



module.exports = router;
