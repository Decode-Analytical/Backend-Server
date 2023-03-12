const express = require("express");
const validator = require("../middleware/validator");
const joiSchema = require("../utils/joiSchema");
const auth = require("../middleware/auth");
const {
  signUp,
  userLogin,
  resetPassword,
  forgetPassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/signup", validator(joiSchema.signup, "body"), signUp);
router.post("/login", validator(joiSchema.login, "body"), userLogin);
router.use(auth);
router.post(
  "/forgotpassword",
  validator(joiSchema.email, "body"),
  forgetPassword
);
// router.get('/forget-password',)
router.post(
  "/resetpassword/:resetToken",
  validator(joiSchema.password, "body"),
  resetPassword
);

module.exports = router;
