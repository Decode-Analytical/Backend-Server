const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/multer.js');
const { 
    studentRegisterCourse, 
    studentViewCourse, 
    studentDeleteCourse, 
    studentViewPaidCourse,
    studentUpdateStatus,
    studentViewAllCourse,
    studentUpdateProfile,
    studentUpdateRole,
    studentUpdatePassword,
    studentCount,
    studentPaidCount,
    studentCourseCount,
    studentUpdateProfilePicture,
    studentViewCourseDetails,
    studentTotalRegisteredCourse,
    markComplete
} = require('../controllers/student.controller.js')
const { auth } = require('../middleware/auth.js');



router.use(auth);
router.put('/markcomplete/:courseId/:moduleId/',markComplete);
router.post('/studentPost/:courseId', studentRegisterCourse );
router.get('/studentGet', studentViewCourse );
router.delete('/studentDelete/:courseId', studentDeleteCourse );
router.get('/studentViewPaidCourse', studentViewPaidCourse );
router.put("/studentUpdateStatus", studentUpdateStatus );
router.get('/studentViewAllCourse', studentViewAllCourse );
router.put('/studentUpdateProfile', studentUpdateProfile );
router.put('/studentUpdateProfilePicture', upload.fields([{ name: "picture", maxCount: 1}]), studentUpdateProfilePicture );
router.get('/studentCount', studentCount)
router.put('/studentUpdatePassword', studentUpdatePassword);
router.put('/studentUpdateRole', studentUpdateRole);
router.get('/studentPaidCount', studentPaidCount );
router.get('/studentCourseCount/:courseId', studentCourseCount);
router.get('/studentViewCourse/:courseId', studentViewCourseDetails  );
router.get('/studentViewTotalCourse', studentTotalRegisteredCourse  );
router.put('/markcomplete/:courseId/:moduleId/',markComplete);


module.exports = router;
