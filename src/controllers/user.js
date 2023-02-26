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
    await user.generateAuthToken();
    CommonService.createdResponse("User created successfully", user, res);
  } catch (error) {
    CommonService.failureResponse(error.message, res);
  }
};

module.exports = signUp;
