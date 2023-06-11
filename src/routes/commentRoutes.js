const express = require("express");
const auth = require("../middleware/auth");
const commentCrtl = require('../controllers/commentCtrl');
const { getaCourse } = require("../controllers/courseCtrl");
const router = express.Router();

router.post('/comment', commentCrtl.addComment);
router.get('/getComment', commentCrtl.getComment);
router.post('/deleteComment', commentCrtl.deleteComment);
router.post('/edit/Comment', commentCrtl.editComment);
router.post('/replyComment', commentCrtl.replyComment);



module.exports = router