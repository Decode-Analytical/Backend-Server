const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentBody: {
      type: String,
      required: [true, "only 255 characters allowed"],
      maxLength: 255,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null // if not populated, then its a top level comment
    },
    commentReplies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false, // if populated, then its a top level comment i.e, it has reply fields
      },
    ],
    likeBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    dislikeBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
      ],
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
