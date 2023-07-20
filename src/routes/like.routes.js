const express = require("express");
const {auth} = require("../middleware/auth");
const {fetchCourse} = require("../middleware/course");

const {test,getLikes,likeCourse,dislikeCourse, likeComment, dislikeComment} = require('../controllers/like.controller');
const router = express.Router();
 
// likeCourse
router.all('/:courseId/random', test)

router.use(auth);
router.get('/:courseId/',getLikes)

router.use('/:courseId/',fetchCourse); //middle ware that fetches course and return error if course not found
router.route('/:courseId/like').put(likeCourse).put(dislikeCourse)

router.put('/:comment/like',likeComment)
router.put('/:comment/dislike',dislikeComment)

module.exports = router;