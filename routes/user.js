const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../utils/validation/user")
const validation =require("../middlewares/validateRequest")
const { signup, login } = require("../controllers/user");
//const multer = require("multer");
//const singleImageUpload = require("../middlewares/uploadSingleImage");

router.post("/signup",validation(createUser), signup);
router.post("/login",validation(loginUser), login);



module.exports = router; 