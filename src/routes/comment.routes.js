const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addComment,
  getCourseComments,
  getCommentById,
  deleteComment,
  updateComment,
  replyComment,
  deleteCommentReply
} = (commentController = require("../controllers/comment.controller"));
const course = require("../middleware/course");
const router = express.Router();

router.use(auth);

router.post("/reply/:commentId",replyComment) //reply to comment
router.delete("/reply/:commentId",deleteCommentReply); //delete a reply to comment
router.get("/course/:courseId/",getCourseComments) //get comments for a course
router.put("/:commentId", updateComment) //edit a comment
router.delete("/:commentId", deleteComment); //delete a comment
router.get("/:commentId",getCommentById) //get comment by id


router.use("/:courseId/", course.fetchCourse); // middleware that checks if the course exists
router.post("/:courseId/",addComment) //add a comment


module.exports = router;
