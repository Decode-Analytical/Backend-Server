const User = require("../models/user");

const signUp = async (req, res) => {
  try {
    const { email, firstName } = req.body;
    const existingUser = User.findOne({ email });
    if (existingUser)
      res.status(422).json({
        STATUS: "FAILURE",
        MESSAGE: "User already exist",
      });
    const user = await User.create(req.body);
    //Generate token using JWT
    const token = await user.generateAuthToken();
    // Using nodemailer (SMTP) for email sending/testing
    sendWelcomeEmail({
      email,
      subject: "Thanks for joining in!",
      message: `Welcome to Learn More, ${firstName}. Let us know how you get along with the app`,
    });
    res.status(201).json({
      STATUS: "SUCESS",
      MESSAGE: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      STATUS: "FAILURE",
      MESSAGE: "Internal server error",
    });
  }
};

module.exports = signUp;
