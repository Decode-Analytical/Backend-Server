const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require('../utils/multer');
const { createCourse, getCourses, updateCourse, deleteCourse, searchCourse, getAllCourses,   } = require('../controllers/course.controller');
const router = express.Router();


router.use(auth);
router.post("/new-course", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), createCourse  ), 
router.get("/user", getCourses);
router.put("/:id", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), updateCourse);

router.delete("/:id", deleteCourse);
router.get("/search", searchCourse); 
router.get("/", getAllCourses);



module.exports = router;