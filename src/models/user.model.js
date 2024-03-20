const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName must be Provided"],
      trim: true,
      match: [/^\w+$/, "Please enter a valid firstName"],
    },
    lastName: {
      type: String,
      required: [true, "lastName must be Provided"],
      trim: true,
      match: [/^\w+$/, "Please enter a valid lastName"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
      validate: {
        validator: function (v) {
          return /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      }
    },
    courses:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    isEmailActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      match: /[0-9]{10}/,
      validate: {
        validator: function (v) {
          return /[0-9]{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      }
    },
    earnings: {
      type: Number,
      default: 0,
    },
    wallet: {
      type: Number,
      default: 0,
      float: true,
    },
    picture: {
      type: Array,
    },
    replies: {
      type: Array,
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    comments: {
      type: Array,
    },
    roles: {
      type: String,
      enum: ["student", "IT", "admin", "superadmin"],
      default: "student",
  },
  courseLimit: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
    float: true
  },
  score: {
    type: Number,
    default: 0,
    float: true
  },
  facebook: {
    type: String,
    default: "",
    match: /[a-zA-Z0-9_]+/,
  },
  twitter: {
    type: String,
    default: "",
    match: /[a-zA-Z0-9_]+/,
  },
  linkedinUrl: {
    type: String,
    default: "",
    match: /^[a-zA-Z0-9_]+$/,
  },
  githubUrl: {
    type: String,
    default: "",
    match: /^[a-zA-Z0-9_]+$/,
  },
  youtubeUrl: {
    type: String,
    default: "",
    match: /^[a-zA-Z0-9_]+$/,
  },
  instagramUrl: {
    type: String,
    default: "",
    match: /^[a-zA-Z0-9_]+$/,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);