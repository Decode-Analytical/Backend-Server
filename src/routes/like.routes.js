const express = require("express");
const {auth} = require("../middleware/auth");
const {fetchCourse} = require("../middleware/course");

const {test,getLikes,likeCourse,dislikeCourse} = require('../controllers/like.controller');
const router = express.Router();
 
// likeCourse
router.all('/:courseId/random', test)

router.use(auth);
router.get('/:courseId/',getLikes)

router.use('/:courseId/',fetchCourse); 

router.route('/:courseId/like').put(likeCourse).put(dislikeCourse)


module.exports = router;