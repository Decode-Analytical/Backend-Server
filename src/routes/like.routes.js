const express = require("express");
const auth = require("../middleware/auth");
const likeController = require('../controllers/like.controller');
const router = express.Router();

// likeCourse

router.get('/', likeController.test)
router.put('/', likeController.likeCourse)
module.exports = router;