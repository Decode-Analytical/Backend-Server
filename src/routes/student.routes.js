const express = require('express');
const router = express.Router();
const { 
    studentRegisterCourse, 
    studentViewCourse, 
    studentDeleteCourse, 
    studentViewPaidCourse,
    studentUpdateStatus } = require('../controllers/student.controller.js')
const { auth } = require('../middleware/auth.js');


router.use(auth);
router.post('/enroll/:courseId', studentRegisterCourse );
router.get('/courses', studentViewCourse );
router.delete('/course/:courseId', studentDeleteCourse );
router.get('/courses/enrolled', studentViewPaidCourse );
router.put("/status", studentUpdateStatus );

module.exports = router;
