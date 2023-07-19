const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addComment,
  getComments,
  getCommentById,
  deleteComment,
  updateComment,
  replyComment,
  deleteCommentReply
} = (commentController = require("../controllers/comment.controller"));
const course = require("../middleware/course");
const router = express.Router();

router.use(auth);

router.route("/reply/:commentId").post(replyComment).delete(deleteCommentReply);

router.use("/:courseId/", course.fetchCourse); // middleware that checks if the course exists
router.route("/:courseId/").post(addComment).get(getComments)
router
  .route("/:courseId/:commentId")
  .get(getCommentById)
  .put(updateComment)
  .delete(deleteComment);


// router.post('/replyComment', commentController.replyComment);

// router.post('/comment', commentController.addComment);
// router.get('/getComment', commentController.getComment);
// router.post('/deleteComment', commentController.deleteComment);
// router.post('/edit/Comment', commentController.editComment);
// router.post('/replyComment', commentController.replyComment);

module.exports = router;
