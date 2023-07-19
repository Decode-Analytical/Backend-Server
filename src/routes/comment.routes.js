const express = require("express");
const { auth } = require("../middleware/auth");
const { createComment, getComments, deleteComment, updateComment, replyComment } = require('../controllers/comment.controller');
const router = express.Router();

router.use(auth);
router.post('/comment/:courseId', createComment);
router.get('/getComment/:courseId', getComments);
router.delete('/deleteComment/:commentId', deleteComment);
router.put('/edit/Comment/:courseId/:commentId', updateComment);
router.post('/replyComment/:commentId', replyComment);


module.exports = router