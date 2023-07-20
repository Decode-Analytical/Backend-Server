const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require('../utils/multer');
const { createCourse, getCourses, updateCourse, deleteCourse, searchCourse,   } = require('../controllers/course.controller');
const router = express.Router();

router.use(auth);
router.post("/registeredCourse", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), createCourse  ), 
router.get("/viewCourse", getCourses);
router.put("/editCourse/:id", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), updateCourse);

router.delete("/deleteCourse/:id", deleteCourse);
router.get("/searchingCourse", searchCourse);



module.exports = router;