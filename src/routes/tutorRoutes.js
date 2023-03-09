const express = require("express");
const validator = require("../middleware/validator");
const joiSchema = require("../utils/joiSchema");
const { signUp, userLogin } = require("../controllers/user");

const router = new express.Router();

router.post("/signup", validator(joiSchema.signup, "body"), signUp);
router.post("/login", validator(joiSchema.login, "body"), userLogin);
// router.post('/forget-password')
// router.get('/forget-password')
// router.post('/reset-password')

module.exports = router;
