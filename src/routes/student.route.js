const router = require('express').Router();
const studentController = require('../controllers/student.controller.js')
const auth = require('../middleware/auth');

router.get('/:id', auth, studentController.getCourse);
router.post('/:id', auth, studentController.createCourse);
router.get('/', auth, studentController.studentLoginCourse);
router.put('/:id/pay', auth, studentController.paidCourse);
router.post('/:id/point', auth, studentController.addPoint);

module.exports = router;
