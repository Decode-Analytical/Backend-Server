const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    isEmailActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
      select: true,
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters, with at least one uppercase letter, one lowercase letter, one number and one special character"],
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    picture: {
      type: Array,
    },
    replies: {
      type: Array,
    },
    comments: {
      type: Array,
    },
    roles: {
      type: String,
      enum: ["admin", "student", "IT"],
      default: "student",
  },
  points: {
    type: Number,
    default: 0,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);