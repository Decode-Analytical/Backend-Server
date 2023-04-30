const router = require('express').Router();
const validator = require("../middleware/validator");
const joiSchema = require("../utils/joiSchema");
const auth = require("../middleware/auth");
const {
  signUp,
  userLogin,
  resetPassword,
  forgetPassword,
} = require("../controllers/user.controller");

router.get('/ping', (req, res, next)=>{
  return res.send('pong')
})
router.post("/signup", validator(joiSchema.signup, "body"), signUp);
router.post("/login", validator(joiSchema.login, "body"), userLogin);

router.post(
  "/forgotpassword",
  auth,
  validator(joiSchema.email, "body"), 
  forgetPassword
);

router.post(
  "/resetpassword/:resetToken",
  auth,
  validator(joiSchema.password, "body"),
  resetPassword
);

module.exports = router;