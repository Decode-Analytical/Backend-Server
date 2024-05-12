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
    viewQuestions,
    viewReviews,
    reviewCourse,
    viewReviewsByCourse,
    deleteReview,
    updateReview,
    getCourseById,
    viewCourseById,
    getCoursesByUserId,
    updateCourseUpload,
    getCoursesDisplay,
    getCoursesDisplayBySkill,
    getCoursesDisplayBycourse_title,
    getCoursesByCourseId

       } = require('../controllers/course.controller');
const router = express.Router();

router.get('/getCoursesDisplay', getCoursesDisplay );
router.get('/getCoursesDisplayBySkill/:skill_level', getCoursesDisplayBySkill );
router.get('/getCoursesDisplayBycourse_title/:course_title', getCoursesDisplayBycourse_title );
router.get('/getCoursesById/:courseId', getCoursesByCourseId)
router.use(auth);
router.post("/registeredCourse", upload.fields([{ name: "course_image", maxCount: 1 }]),  createCourse );
router.put("/updateCourse/:courseId", updateCourse )
router.get("/viewCourse", getCourses);
router.get("/search/:course_title", searchCourse);
router.delete("/deleteCourse/:courseId", deleteCourse);
router.put("/editSubject/:courseId/:subjectId", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), updateSubject);

router.post("/createSubject/:courseId", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), addSubject); 
router.get("/viewAllSubjects", viewSubjects);
router.delete("/deleteSubject/:courseId/subjectId", deleteSubject);
router.get("/viewAllCourses", getAllCourses);
router.post("/addQuestion/:courseId/:subjectId", addQuestion );
router.put("/updateQuestion/:courseId/:subjectId", updateQuestion);
router.delete("/deleteQuestion/:courseId/:subjectId", deleteQuestion);
router.get("/viewAllQuestions/:courseId", viewQuestions);
router.get("/viewCourseById/:courseId", getCourseById);
router.get("/getViewCourseById/:courseId", viewCourseById);
router.get("/viewCourseByItsId/:courseId", getCoursesByUserId);
router.put("/updateCourseUpload/:courseId", updateCourseUpload);

// Review routes
router.get("/review", viewReviews);
router.get("/review/:courseId", viewReviewsByCourse);
router.post("/review/:courseId", reviewCourse);
router.delete("/review/:reviewId", deleteReview );
router.put("/review/:reviewId", updateReview);



module.exports = router;