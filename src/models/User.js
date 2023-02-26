const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const responseStatusCodes = require("../utils/util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CommonService = require("../utils/commonService");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name must be Provided"],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(mail) {
        if (!validator.isEmail(mail))
          throw new Error({
            message: "Invalid Email",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate: (password) => {
        if (password.toLowerCase().includes("password"))
          throw new Error({
            message: "You can't use the word password",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

// User Token Generation
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Removing sensitive datas from the user
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

//UserLogin Authentication
userSchema.statics.findByCredentials = async (email, password, res) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User does not exist");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

//Hashing User plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
