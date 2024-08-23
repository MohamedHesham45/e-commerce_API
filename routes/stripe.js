const express = require("express");
const router = express.Router();
const { completePayment, stripe ,cancel} = require("../controllers/stripe");

router.post("/checkout",stripe);

router.get("/complete",completePayment);

router.get("/cancel",cancel);

module.exports = router;
