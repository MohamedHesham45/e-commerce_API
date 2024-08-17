const express = require("express");
const router = express.Router();
const { createUser} = require("../utils/validation/user")
const validation =require("../middlewares/validateRequest")
const {creatAdmin}=require("../controllers/admin")
const checkRole=require("../middlewares/checkRole")
const auth=require("../middlewares/auth")

router.post("/creatAdmin",auth,checkRole(["admin"]),validation(createUser), creatAdmin);
module.exports = router; 