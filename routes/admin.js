const express = require("express");
const router = express.Router();

///////////////////////////////////////controllers///////////////////////////////
const { creatAdmin } = require("../controllers/admin");

//////////////////////////////////////middlewares////////////////////////////
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validateRequest");


//////////////////////////////////validation//////////////////////////////////
const { createUser } = require("../utils/validation/user");


router.post(
    "/creat-admin",
    auth,
    checkRole(["admin"]),
    validation(createUser),
    creatAdmin
);
module.exports = router;