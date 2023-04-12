const express = require("express");
const auth = require("../middleware/auth");
const likeCrtl = require('../controllers/likeCtrl');
const router = express.Router();

router.post('/likeComment', likeCrtl.likeComment);
router.post('/unlikeComment', likeCrtl.unlikeComment);


module.exports = router