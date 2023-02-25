const User = require("../models/user");
const responseStatusCodes = require("../utils/util");

const signUp = async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(responseStatusCodes.CONFLICT).json({
        STATUS: "FAILURE",
        MESSAGE: "User already exist",
      });
    const user = await User.create(req.body);
    //Generate token using JWT
    const token = await user.generateAuthToken();
    res.status(201).json({
      STATUS: "SUCESS",
      MESSAGE: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      STATUS: "FAILURE",
      MESSAGE: error.message,
    });
  }
};

module.exports = signUp;
