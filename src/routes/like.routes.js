const express = require("express");
const { auth } = require("../middleware/auth");
const { likeCourse, unlikeCourse } = require('../controllers/like.controller');
const router = express.Router();

router.use(auth);
router.put('/like/:id', likeCourse);
router.put('/like/:id', unlikeCourse);

module.exports = router;