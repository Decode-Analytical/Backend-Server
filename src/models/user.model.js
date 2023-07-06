const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const responseStatusCodes = require("../utils/util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName must be Provided"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName must be Provided"],
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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    tutor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// User document relationship with other document (to enable populate)
//Virtual fields
userSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "ratings.postedby",
});

userSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("tutors", {
  ref: "Tutor",
  localField: "_id",
  foreignField: "userId",
});
// User Token Generation
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
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
  if (!isMatch) throw new Error("Invalid email or password");
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

// Generate and hash password token
userSchema.methods.generateResetPasswordToken = async function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and send to resetPassword token field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  await this.save();

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
