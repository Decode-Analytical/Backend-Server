const User = require("../models/user");
const CommonService = require("../utils/commonService");
const sendEmail = require("../emails/email");
const { SUCCESS } = require("../utils/util");
const logger = require("../utils/logger");

const signUp = async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return CommonService.conflictResponse("User already exist", res);
    const user = await User.create(req.body);
    //Generate token using JWT
    const token = await user.generateAuthToken();
    //Send Welcome Email
    sendEmail({
      email: email,
      subject: "Thanks for joining in!",
      message: `Welcome to Learn More, ${fullName}. Let us know how you get along with the app`,
    });
    CommonService.createdResponse(user, token, res);
  } catch (error) {
    CommonService.failureResponse(error.message, res);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password, res);
    if (user) {
      const token = await user.generateAuthToken();
      return res.status(200).json({ user, token });
    }
  } catch (error) {
    CommonService.failureResponse(error.message, res);
  }
};

const forgetPassword = async (req, res) => {
  // Search for user Account
  const { email } = req.body;
  
    const user = await User.findOne({ email });
    if (!user)
      return CommonService.notFoundResponse(
        "Sorry, we don't recognize this account",
        res
      );
    //Generate reset Token
    const resetToken = user.generateResetPasswordToken();
    // Create reset url
    const resetURl = `${req.protocol}://${req.get(
      "host"
    )}/rest_password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetURl}`;
  try {
    // Send reset URL to user via Mail
    await sendEmail({
      email: email,
      subject: "LEARN MORE PASSWORD RESET REQUEST",
      message: message,
    });

    CommonService.successResponse(res, "Email Sent");
  } catch (error) {
    logger.error(error)
    return res.CommonService.serverError("Email could not be sent", res);
  }

  const resetPassword = async (req, res) => {
    const resetToken = req.params.resetToken
    // Hash token
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user) return CommonService.failureResponse("Invalid or Expired Token", res)
     // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save()

  CommonService.successResponse(res, user)

  }
};

module.exports = { signUp, userLogin, forgetPassword };
