const User = require("../models/user");
const CommonService = require("../utils/commonService");

const signUp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return CommonService.conflictResponse("User already exist", res);
    const user = await User.create(req.body);
    //Generate token using JWT
    const token = await user.generateAuthToken();
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
module.exports = { signUp, userLogin };
