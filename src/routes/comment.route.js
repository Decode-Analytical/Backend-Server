const express = require("express");
const auth = require("../middleware/auth");
const commentController = require('../controllers/comment.controller');
const router = express.Router();

router.post('/comment', commentController.addComment);
router.get('/getComment', commentController.getComment);
router.post('/deleteComment', commentController.deleteComment);
router.post('/edit/Comment', commentController.editComment);
router.post('/replyComment', commentController.replyComment);


module.exports = router