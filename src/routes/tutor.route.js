const express = require('express');
const tutorController = require('../controllers/tutor.controller');
const auth = require('../middleware/auth');
const router = express.Router();

//Register Tutor
router.post('/register', auth, tutorController.addTutor);
router.get('/courses', auth, tutorController.allCourses);
router.post('/addCourse', auth, tutorController.addNewCourse);
router.delete('/courses/:id', auth, tutorController.removeCourse);
router.put('/courses/:id', auth, tutorController.updateCourse);

module.exports = router;