const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const pinController = require('../controllers/pin.controller');

router.use(auth);
router.post('/generatePin', pinController.createPin);
router.put('/updatePin', pinController.updatePin);

module.exports = router;