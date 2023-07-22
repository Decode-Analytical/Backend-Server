const express = require("express");
const {auth} = require("../middleware/auth");
const {fetchCourse} = require("../middleware/course");

const {test,getLikes,likeCourse,dislikeCourse,getCommentLikes, likeComment, dislikeComment} = require('../controllers/like.controller');
const router = express.Router();
 
// likeCourse
router.all('/:courseId/random', test)

router.use(auth);
router.get('/:courseId/',getLikes)
router.put('/:commentId/like',likeComment)
router.put('/:commentId/dislike',dislikeComment)
router.get('/:commentId/like',getCommentLikes)


router.use('/:courseId/',fetchCourse); //middle ware that fetches course and return error if course not found
router.put('/:courseId/like',likeCourse)
router.put('/:courseId/dislike',dislikeCourse)


module.exports = router;