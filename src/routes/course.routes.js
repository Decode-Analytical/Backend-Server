const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require('../utils/multer');
const { createCourse, 
    getCourses, 
    updateCourse, 
    deleteCourse, 
    searchCourse, 
    getAllCourses,
    addSubject, 
    addQuestion, 
    updateSubject,
    deleteSubject,
    deleteQuestion,
    updateQuestion,
    viewSubjects,
    viewQuestions   } = require('../controllers/course.controller');
const router = express.Router();


router.get("/searchingCourse", searchCourse);
router.use(auth);
router.post("/registeredCourse", createCourse );
router.put("/updateCourse/:courseId", updateCourse )
router.get("/viewCourse", getCourses);
router.delete("deleteCourse/:courseId", deleteCourse);
router.put("/editSubject/:courseId/:subjectId", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), updateSubject);

router.post("/createSubject/:courseId", upload.fields([
    { name: "images", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), addSubject);
router.get("/viewAllSubjects", viewSubjects);
router.delete("/deleteSubject/:courseId/subjectId", deleteSubject);
router.get("/viewAllCourses", getAllCourses);
router.post("/addQuestion/:courseId/:subjectId", addQuestion );
router.put("/updateQuestion/:courseId/:subjectId", updateQuestion);
router.delete("/deleteQuestion/:courseId/:subjectId", deleteQuestion);
router.get("/viewAllQuestions", viewQuestions);


module.exports = router;