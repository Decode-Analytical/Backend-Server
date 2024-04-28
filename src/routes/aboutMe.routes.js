const express = require("express");
const { auth } = require('../middleware/auth');
const aboutMeController = require("../controllers/aboutMe.controller");
const router = express.Router();

router.use(auth);
router.post("/createAboutMe", aboutMeController.createAboutMe);
router.get("/getAboutMe", aboutMeController.getAboutMe);
router.put("/updateAboutMe", aboutMeController.updateAboutMe);
router.delete("/deleteAboutMe", aboutMeController.deleteAboutMe);


module.exports = router;
