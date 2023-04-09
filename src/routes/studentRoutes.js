const router = require('express').Router();

import {
  getCourse,
  createCourse,
  paidCourse,
  studentLoginCourse,
  addPoint
} from '../controllers/studentController.js';
import auth from '../middleware/auth.js';

router.get('/:id', auth, getCourse);
router.post('/:id', auth, createCourse);
router.get('/', auth, studentLoginCourse);
router.put('/:id/pay', auth, paidCourse);
router.post('/:id/point', auth, addPoint);

export default router;
