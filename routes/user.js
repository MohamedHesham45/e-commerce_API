const express = require("express");
const router = express.Router();
const { createUser, loginUser,tokenRefresh } = require("../utils/validation/user")
const validation =require("../middlewares/validateRequest")
const { signup, login ,refreshToken} = require("../controllers/user");
const multer = require("multer");
const singleImageUpload = require("../middlewares/uploadSingleImage");
const deleteImage=require("../middlewares/deleteImage")

router.post("/signup",validation(createUser), signup);
router.post("/login",validation(loginUser), login);



module.exports = router; 