const express = require("express");
const router = express.Router();

///////////////////////////////////////controllers///////////////////////////////
const { creatAdmin, editAdmin, deleteAdmin, getAllAdmin } = require("../controllers/admin");

//////////////////////////////////////middlewares////////////////////////////
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validateRequest");


//////////////////////////////////validation//////////////////////////////////
const { createAdminValidation, updateAdminValidation } = require("../utils/validation/admin");



router.post(
    "/admin",
    auth,
    checkRole(["admin"]),
    validation(createAdminValidation),
    creatAdmin
);
router.get(
    "/admin",
    auth,
    checkRole(["admin"]),
    getAllAdmin

)
router.patch("/admin/:id",
    auth,
    checkRole(["admin"]),
    validation(updateAdminValidation),
    editAdmin
)
router.delete("/admin/:id",
    auth,
    checkRole(["admin"]),
    deleteAdmin
)

module.exports = router;