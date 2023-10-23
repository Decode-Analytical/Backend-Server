const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
    adminUpdateUserRoles, 
    adminViewTransactions,
    adminViewStudents,
    adminViewCourses,
    adminViewComments,
    adminTotalStudent,
    adminTotalPayment,
    adminLogin,
    adminViewProfile,
    adminViewAllInstructors,
    adminTotalStudentForCourse,
    studentJoinMeeting,
    adminScheduleMeeting 
  } = require('../controllers/admin.controller');

router.post('/adminSignIn', adminLogin);
router.use(auth);
router.put('/roles', adminUpdateUserRoles);
router.get('/viewTransaction', adminViewTransactions );
router.get('/ViewStudent', adminViewStudents  );
router.get('/viewCourse', adminViewCourses  );
router.get('/viewComment', adminViewComments  );
router.get('/totalStudent', adminTotalStudent   );
router.get('/viewTotalPayment', adminTotalPayment  );
router.get('/ViewInstructorProfile', adminViewProfile  );
router.get('/viewAllInstructors', adminViewAllInstructors)
router.get('/totalStudentRegisteredForCourse', adminTotalStudentForCourse);
router.get('/studentJoinMeeting', studentJoinMeeting );
router.post('/adminScheduleMeeting', adminScheduleMeeting  );

module.exports = router;