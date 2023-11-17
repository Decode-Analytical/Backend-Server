const express = require("express");
const {courseChat} = require('../controllers/chat.controller');
const { auth } = require("../middleware/auth");

const router = express.Router();

router.use(auth);

// Route for handling course chat
router.post("/messages",courseChat);

module.exports = router;
