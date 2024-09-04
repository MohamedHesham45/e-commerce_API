const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProductById,
    getProductsByCategoryAndDiscount,
    searchProducts,
    updateProduct,
    deleteProduct,
    addReviews,
} = require("../controllers/productController");


const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validateRequest");
const singleImageUpload = require("../middlewares/uploadSingleImage");
const multipleImageUpload = require("../middlewares/uploadMultipleImages");
const multer = require("multer");
const upload = multer();


const {
    createProductSchema,
    updateProductSchema,
} = require("../utils/validation/productvalidation");
const { stripe } = require("../controllers/stripe");

router.post(
    "/product",
    auth,
    checkRole(["admin"]),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    validation(createProductSchema),
    singleImageUpload,
    multipleImageUpload,
    createProduct
);
router.get("/product/:id",getProductById)
router.get("/product",getProductsByCategoryAndDiscount)
router.get("/search",searchProducts)
router.post("/api/payment/checkout",stripe)
router.patch(
    "/product/:id",
    auth,
    checkRole(["admin"]),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    validation(updateProductSchema),
    singleImageUpload,
    multipleImageUpload,
    updateProduct
)
router.delete("/product/:id",
    auth,
    checkRole(["admin"]),
    deleteProduct
)
router.post("/product/review/:id",auth,addReviews)
module.exports = router;
