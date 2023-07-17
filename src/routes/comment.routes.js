const express = require("express");
const auth = require("../middleware/auth");
const commentController = require('../controllers/comment.controller');
const course = require('../middleware/course');
const router = express.Router();

router.use('/:courseId/',course.fetchCourse)// middleware that checks if the course exists
router.post('/:courseId/', commentController.addComment);
router.get('/:courseId/', commentController.getComments);
router.get('/:courseId/:commentId', commentController.getCommentById);
router.delete('/:courseId/:commentId', commentController.deleteComment);
router.put('/:courseId/:commentId', commentController.updateComment);
 
// router.post('/replyComment', commentController.replyComment);

// router.post('/comment', commentController.addComment);
// router.get('/getComment', commentController.getComment);
// router.post('/deleteComment', commentController.deleteComment);
// router.post('/edit/Comment', commentController.editComment);
// router.post('/replyComment', commentController.replyComment);


module.exports = router;