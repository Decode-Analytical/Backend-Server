const express = require("express");
const {auth} = require("../middleware/auth");
const {fetchCourse} = require("../middleware/course");

const {test,getCourseLikesAndDislikes,likeCourse,dislikeCourse,getCommentLikes, likeComment, dislikeComment} = require('../controllers/like.controller');
const router = express.Router();
 
// likeCourse
router.all('/:courseId/random', test)

router.use(auth);
router.get('/course/:courseId/',getCourseLikesAndDislikes)
router.get('/comment/:commentId/',getCommentLikes)
router.put('/comment/:commentId/like',likeComment)
router.put('/comment/:commentId/dislike',dislikeComment)


router.use('/course/:courseId/',fetchCourse); //middle ware that fetches course and return error if course not found
router.put('/course/:courseId/like',likeCourse)
router.put('/course/:courseId/dislike',dislikeCourse)


module.exports = router;