const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating schema
const userSchema = new Schema(
  {
    name: {
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
          throw new AppError({
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
          throw new AppError({
            message: "You can't use the word password",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
