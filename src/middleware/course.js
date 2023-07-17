const Course = require('../models/course.model')

/**middleware to fetch a course by Id */
exports.fetchCourse = async ( req, res, next ) => {
    const {courseId} = req.params
    const course = await Course.findById(courseId, "_id userId title summary description comment_count");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log({fullUrl})
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    req.course = course;
    next();
}

