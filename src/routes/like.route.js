const express = require("express");
const auth = require("../middleware/auth");
const likeController = require('../controllers/like.controller');
const router = express.Router();

router.post('/likeComment', likeController.likeComment);
router.post('/unlikeComment', likeController.unlikeComment);

module.exports = router