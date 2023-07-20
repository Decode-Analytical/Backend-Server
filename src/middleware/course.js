const Course = require('../models/course.model')

/**middleware to fetch a course by Id and check if the course exists */
exports.fetchCourse = async ( req, res, next ) => {
    const {courseId} = req.params
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    req.course = course;
    next(); 
}



