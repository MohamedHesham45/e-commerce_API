const express = require("express");
const router = express.Router();


const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validateRequest");


const {
    deleteCategory,
    updateCategory,
    getCategories,
    createCategory,
} = require("../controllers/categoryController");


const {
    categoryValidation,
} = require("../utils/validation/categoryValidation");

router.post(
    "/category",
    auth,
    checkRole(["admin"]),
    validation(categoryValidation),
    createCategory
);
router.get(
    "/category",
    
    getCategories
);
router.patch(
    "/category/:id",
    auth,
    checkRole(["admin"]),
    validation(categoryValidation),
    updateCategory
);
router.delete(
    "/category/:id",
    auth,
    checkRole(["admin"]),
    deleteCategory
);

module.exports = router;
