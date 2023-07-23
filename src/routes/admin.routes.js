const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
    adminUpdateUserRoles, 
    adminViewTransactions,
    adminViewStudents,
    adminViewCourses,
    adminViewComments,
    adminTotalStudent 
  } = require('../controllers/admin.controller');


router.use(auth);
router.put('/roles', adminUpdateUserRoles);
router.get('/transactions', adminViewTransactions );
router.get('/users', adminViewStudents  ); //DOING THE SAME WITH ROUTE BELOW
router.get('/viewCourse', adminViewCourses  );
router.get('/comments', adminViewComments  );
router.get('/total-student', adminTotalStudent   );


module.exports = router;