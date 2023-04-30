const express = require("express");
const courseController = require('../controllers/course.controller');
const storage = require('../utils/multer');
const router = express.Router();

//Add a course
router.post('/add-course', courseController.addCourse)
//Add Course Contents
router.post('/uploadVideo/:id', storage.videoMulter.array("videofile"), courseController.uploadVideos);
router.post('/uploadAudio/:id', storage.audioMulter.array("audiofile"), courseController.uploadAudios);
router.post('/uploadDocs/:id', storage.docsMulter.array("docsfile"), courseController.uploadDocs);
router.post('/uploadImage/:id', storage.inmageMulter.array("imagefile"), courseController.uploadImage);
//Get Course Contents
router.get('/:courseId/videos', courseController.getCourseVideos);
router.get('/:courseId/videos/:videoId', courseController.getCourseVideos);


module.exports = router;