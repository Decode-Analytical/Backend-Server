const express = require("express");
const validator = require("../middleware/validator");
const joiSchema = require("../utils/joiSchema");
const signupController = require("../controllers/user");

const router = new express.Router();

router.post("/signup", validator(joiSchema.signup, "body"), signupController);

module.exports = router;
