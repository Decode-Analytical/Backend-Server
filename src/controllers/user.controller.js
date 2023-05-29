const User = require("../models/user.model");
const CommonService = require("../utils/commonService");
const sendEmail = require("../emails/email");
const logger = require("../utils/logger");
const crypto = require("crypto");

const signUp = async (req, res) => {
  try {
    const { email, firstName ,lastName} = req.body;
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
      message: `Welcome to Learn More, ${firstName, lastName}. Let us know how you get along with the app`,
    });
    return CommonService.createdResponse(user, token, res);
  } catch (error) {
    return CommonService.failureResponse(error.message, res);
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
  const { email } = req.body;

  // Search for user Account
  const user = await User.findOne({ email });
  if (!user)
    return CommonService.notFoundResponse(
      "Sorry, we don't recognize this account",
      res
    );

  //Generate reset Token
  const resetToken = await user.generateResetPasswordToken();
  // Create reset url
  const resetURl = `${req.protocol}://${req.get(
    "host"
  )}/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetURl}`;

  try {
    // Send reset URL to user via Mail
    sendEmail({
      email: email,
      subject: "PASSWORD RESET REQUEST",
      message: message,
    });

    return CommonService.successResponse(res, "Email Sent");
  } catch (error) {
    logger.error(error);
    return CommonService.serverError("Email could not be sent", res);
  }
};

const resetPassword = async (req, res) => {
  const resetToken = req.params.resetToken;

  // Hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return CommonService.failureResponse("Invalid or Expired Token", res);
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return CommonService.successResponse(res, user);
  } catch (error) {
    CommonService.failureResponse(error.message, res);
  }
};

module.exports = { signUp, userLogin, forgetPassword, resetPassword };
