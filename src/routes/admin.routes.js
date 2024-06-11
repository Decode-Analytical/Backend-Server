const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

router.post('/adminSignIn', adminController.adminLogin);
router.post('/joinmeeting/:roomId', adminController.studentJoinMeeting );
router.post('/receivingPayment', adminController.studentPaid);
router.delete('/deleteMeeting/:meetingId', adminController.deleteMeeting);
router.use(auth);
router.get('/courseWeeklySales/:courseId', adminController.courseWeeklySales);
router.post('/adminScheduleMeeting', adminController.adminScheduleMeeting  );
router.put('/roles', adminController.adminUpdateUserRoles);
router.get('/viewTransaction', adminController.adminViewTransactions );
router.get('/ViewStudent', adminController.adminViewStudents  );
router.get('/viewCourse', adminController.adminViewCourses  );
router.get('/viewComment', adminController.adminViewComments  );
router.get('/totalStudent', adminController.adminTotalStudent   );
router.get('/viewTotalPayment', adminController.adminTotalPayment  );
router.get('/ViewInstructorProfile/:userId', adminController.adminViewProfile  );
router.get('/viewAllInstructors', adminController.adminViewAllInstructors)
router.get('/totalStudentRegisteredForCourse', adminController.adminTotalStudentForCourse);
router.get('/getRoomId', adminController.studentViewAllMeeting);
router.get('/totalStudentRegiesteredForACourse/:courseId', adminController.studentTotalStudentForCourse);
router.get('/tutorViewOwnMeetings', adminController.tutorViewHisMeeting);
router.get('/adminViewAllOnlineMeetings', adminController.adminViewAllMeetings);
router.put('/blockTutorAccount/:tutorId', adminController.blockTutorAccount);
router.get('/totalSales', adminController.totalRegisteredStudents );
router.get('/superAdminViewTotalSales', adminController.totalSales);
router.get('/tutorViewSales', adminController.totalSalesForLiveSession);
router.get('/adminViewTotalLiveSessionSales', adminController.adminTotalSalesForLiveSession);
router.get('/adminViewTotalStudentRegistered', adminController.adminViewTotalStudentRegistered);
router.get('/adminDailyCourseVisitCount', adminController.adminDailyCourseVisitCount);
router.get('/adminMonthlyCourseSalesAnalytics', adminController.adminMonthlyCourseSalesAnalytics);
router.get('/adminWeeklyCourseSalesAnalytics', adminController.adminWeeklyCourseSalesAnalytics);
router.get('/adminMonthlyAndWeeklyCourseSalesAnalytics', adminController.adminMonthlyAndWeeklyCourseSalesAnalytics);
// router.get('/adminDateRangeCourseSalesAnalytics', adminDateRangeCourseSalesAnalytics);
router.get('/adminMonthlyLiveSessionSalesAnalytics', adminController.adminMonthlyLiveSessionSalesAnalytics);
router.get('/adminWeeklyLiveSessionSalesAnalytics', adminController.adminWeeklyLiveSessionSalesAnalytics);
router.get('/adminMonthlyAndWeeklyLiveSessionSalesAnalytics', adminController.adminMonthlyAndWeeklyLiveSessionSalesAnalytics);
router.get('/superAdminTotalEarnings', adminController.superAdminTotalEarnings);
router.get('/adminTotalEarnings', adminController.adminTotalEarnings );
router.delete('/adminDeleteAllMeetingTransactions', adminController.adminDeleteAllMeetingTransactions);
router.get('/adminWeeklyMonthlyAndYearlyEarnings', adminController.adminWeeklyMonthlyAndYearlyEarnings);
router.get('/adminWeeklyMonthlyAndYearlyWithdrawals', adminController.adminWeeklyMonthlyAndYearlyWithdrawals);
router.get('/decodePdfDownloadableFile', adminController.decodePdfDownloadableFile );



// payment for the video tutor
router.post('/paymentInitialized/:roomId', adminController.studentPayForMeeting)

module.exports = router; 