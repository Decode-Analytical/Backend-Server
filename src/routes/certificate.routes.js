const express = require('express');
const { auth } = require('../middleware/auth');
const certificateController = require('../controllers/certificate.controller');
const router = express.Router();


router.use(auth);
router.post('/generate', certificateController.studentCertificate);


module.exports = router;