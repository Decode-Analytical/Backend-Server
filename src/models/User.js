const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const responseStatusCodes = require("../utils/util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
