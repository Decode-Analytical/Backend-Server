const express = require('express');
const router = express.Router();
const { 
    studentRegisterCourse, 
    studentViewCourse, 
    studentDeleteCourse, 
    studentViewPaidCourse,
    studentUpdateStatus,
    studentViewAllCourse } = require('../controllers/student.controller.js')
const { auth } = require('../middleware/auth.js');


router.use(auth);
router.post('/studentPost/:courseId', studentRegisterCourse );
router.get('/studentGet', studentViewCourse );
router.delete('/studentDelete/:courseId', studentDeleteCourse );
router.get('/studentViewPaidCourse', studentViewPaidCourse );
router.put("/studentUpdateStatus", studentUpdateStatus );
router.get('/studentViewAllCourse', studentViewAllCourse );

module.exports = router;
