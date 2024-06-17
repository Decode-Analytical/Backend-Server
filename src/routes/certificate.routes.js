const express = require('express');
const { auth } = require('../middleware/auth');
const certificateController = require('../controllers/certificate.controller');
const router = express.Router();


router.use(auth);
router.post('/generate', certificateController.studentCertificate);
router.get('/getCertificate/:certificateCode', certificateController.getCertificate);


module.exports = router;