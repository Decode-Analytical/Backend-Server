const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addComment,
  getModuleComments,
  getCommentById,
  deleteComment,
  updateComment,
  replyComment,
  getCommentReplies
  
} = (commentController = require("../controllers/comment.controller"));
const course = require("../middleware/course");
const router = express.Router();

router.use(auth);

router.post("/replies/:commentId",replyComment) //reply to comment
router.get("/replies/:commentId",getCommentReplies) //get to comment replies

router.get("/module/:moduleId/",getModuleComments) //get comments for a course
router.put("/:commentId", updateComment) //edit a comment
router.delete("/:commentId", deleteComment); //delete a comment
router.get("/:commentId",getCommentById) //get comment by id


router.post("/module/:moduleId/",addComment) //add a comment


module.exports = router;
