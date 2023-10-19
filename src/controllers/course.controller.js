const { Course, Question, Module } = require("../models/course.model");
const User = require("../models/user.model");
const ffmpeg = require('fluent-ffmpeg');
const Review = require("../models/review.model");

// create a course 
exports.createCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { course_title, course_description, course_language, isPaid_course, isPrice_course } = req.body;
            const existingTitle = await Course.findOne({ course_title });
            if(!existingTitle){
                if(req.files){
                    const course_image = req.files.course_image
            const newCourse = await Course.create({
                userId: userStatus._id,
                course_title,
                course_description,
                course_language,
                course_image: course_image, 
                isPaid_course, 
                isPrice_course,
            })
            return res.status(201).json({
                message: "Course registered successfully",
                newCourse
            })
        }else{
            return res.status(400).json({
                message: "Please upload an image"
            })
        }
        } else{
            return res.status(301).json({
                message: "The title of the course is already existing, kindly proceed to register your module under it."
            })
        }
        }else {
            return res.status(401).json({
                Message: "You are not authorised to perform this action"
            })
        }
    }catch(error){
        return res.status(501).json({
            message: "Error creating course",
            error: error.message 
        });
    }
}



exports.updateCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const courseId = await Course.findById(req.params.courseId);
            if(courseId){
                if(`${courseId.userId}` === `${userStatus._id}`){
                    const { course_title, course_description, course_language, course_level, course_image, isPaid_course, isPrice_course } = req.body;
                    if(req.files){
                    const course_image = req.files.course_image
                    const newCourse = await Course.findByIdAndUpdate(req.params.courseId, {
                        course_title,
                        course_description,
                        course_language,
                        course_level,
                        course_image: course_image,
                        isPaid_course, 
                        isPrice_course
                    },
                    {
                        new: true
                    })
                    return res.status(201).json({
                        message: "Course registered successfully",
                        newCourse
                     });
                }else{
                    return res.status(400).json({
                        message: "Please upload an image"
                    })
                }
                } else {
                    return res.status(401).json({
                        message: "You are not the owner of this course"
                    })
                }
            } else {
                return res.status(400).json({ error: "Course not found" });
            }
        }else {
            return res.status(401).json({
                Message: "You are not authorised to perform this action"
            })
        }
    }catch(error){
        return res.status(501).json({
            message: "Error creating course",
            error: error.message 
        });
    }
}




// delete the course
exports.deleteCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const ownerId = await Course.findById(req.params.courseId);
            if(ownerId.userId.equals(userStatus._id)){
                await Course.findByIdAndDelete(req.params.courseId);
                return res.status(200).json({
                    message: "Course successfully deleted",
                });
            } else {
                return res.status(400).json({ error: "You are not the owner of this course" });
            }
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to delete a course" });
        } 
    } catch (error) {
        return res.status(400).json({
            message: "Error deleting course",
            error: error.message 
        });
    }
}



// view the Course registered  by Admin(one user)
exports.getCourses = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const courses = await Course.find({ userId: userStatus._id });
            return res.status(200).json({
                message: "Courses fetched successfully",
                courses
            });
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to view a course" });
        }
    } catch (error) {
        return res.status(400).json({ 
            message: "Error fetching courses",
            error: error.message 
        });
    }
}

// admin view all courses

exports.getAllCourses = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "student" || userStatus.roles === "IT" || userStatus.roles === "admin"){
            const totalCourses = await Course.count();
            const totalPages = Math.ceil(totalCourses / 10);
            const currentPage = parseInt(req.query.page, 10) || 1;
            const skip = (currentPage - 1) * 10;
            const courses = await Course.find().skip(skip).limit(10);
            return res.status(200).json({
                message: "Courses fetched successfully",
                courses,
                totalPages,
                totalCourses,
                currentPage
            });
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to view a course" });
        }
    } catch (error) {
        return res.status(400).json({ 
            message: "Error fetching courses",
            error: error.message 
        });
    }
}
    



// create subject 
exports.addSubject = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const courseId = await Course.findById(req.params.courseId);
            if(courseId){
            const { module_title, module_description  } = req.body;
            if(req.files){
                image = req.files.image,
                video = req.files.video,
                audio = req.files.audio
                // const module_duration = await getVideoLengthInMinutes(video)
            const newSubject = await Module.create({
                userId: userStatus._id,
                courseId: courseId._id,
                module_title,
                module_description,
                // module_duration,
                audio: audio,
                video: video,
                image: image
            })
            const addSubjectToCourse = await Course.findByIdAndUpdate({ _id: courseId._id}, {$push: { modules: newSubject}}, { new: true})
            return res.status(201).json({
                message: "Subject registered successfully",
                newSubject,
            })
        }else {
            return res.status(400).json({ Message: "Upload a video or audio and image file" });
        }
        }else{
            return res.status(403).json({
                message: "The course not found"
            })
        }
        }else {
            return res.status(401).json({
                Message: "You are not authorised to perform this action"
            })
        }
    }catch(error){
        return res.status(501).json({
            message: "Error creating course",
            error: error.message 
        });
    }
}


// update the courses
exports.updateSubject = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {            
            const subjectId = await Module.findById(req.params.subjectId);
            if(subjectId){
                if(`${subjectId.userId}` === `${userStatus._id}`){
            const { module_title, module_description,   } = req.body;
            if(req.files){
                image = req.files.image,
                video = req.files.video,
                audio = req.files.audio
                const module_duration = await getVideoLengthInMinutes(video)
            const subject = await Module.findByIdAndUpdate(req.params.subjectId, {
                module_title, 
                module_description, 
                module_duration,
                audio: audio,
                video: video,
                image: image
            }, { new: true });
            await Course.findByIdAndUpdate(req.params.courseId, { $set: { nameOfSubject: subject }}, {new: true })
            return res.status(200).json({
                message: "Subject successfully updated",
                subject
            });
            }else {
                return res.status(400).json({ Message: "Upload a video or audio and image file" });
            }
            }else {
                return res.status(400).json({ Error: "You are not the owner of this course" });
            }
            } else {
                return res.status(400).json({ error: "Course not found" });
            }
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to update a course" });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error updating course",
            error: error.message 
        });
    }
}




// view all subjects
exports.viewSubjects = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const subjects = await Module.find({},"._id module_title");
            return res.status(200).json({
                message: "Subjects fetched successfully",
                subjects
            });
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to view a course" });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}



//delete subject by subjectId
exports.deleteSubject = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const subject = await Module.findById(req.params.subjectId);
            if(subject){
                if(`${subject.userId}` === `${userStatus._id}`){
            const subjects = await Module.findByIdAndDelete(req.params.subjectId);
            return res.status(200).json({
                message: "Subject successfully deleted",
                subjects
            });
            } else {
                return res.status(400).json({ error: "You are not the owner of this course" });
            }
            } else {
                return res.status(400).json({ error: "Course not found" });
            }
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to delete a course" });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error deleting course",
            error: error.message 
        });
    }
}


// search course by title or category
exports.searchCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const course_title = req.query.course_title;
            const course = await Course.find({
                course_title: { $regex: `${course_title}`, $options: 'i' }
            });
            return res.status(200).json({
                message: "Course fetched successfully",
                course
            });
        } else {
            return res.status(400).json({ error: "User must login as student or Admin in order to search for a course" });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}
      




// create question
exports.addQuestion = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { courseId, subjectId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const subject = await Module.findById(subjectId);
                if(subject){
            const { question, options, correct_answer } = req.body;
            const newQuestion = await Question.create({
                question,
                options,
                correct_answer
            })
            const newSubject = await Module.findByIdAndUpdate({ _id: subjectId}, {$push: {questions: newQuestion}}, { new: true})
            const courseleve = await Course.findByIdAndUpdate({ _id: courseId}, {$push: {subjects: newSubject}}, { new: true})
            return res.status(201).json({
                message: "Question registered successfully",
                newQuestion,
                newSubject,
                courseleve
            })
            }else{
                return res.status(403).json({
                    message: "The module not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "The course not found"
            })
        }
    }else {
        return res.status(401).json({
            Message: "You are not authorised to perform this action"
        })
    }
}
    catch(error){
        return res.status(501).json({
            message: "Error creating course",
            error: error.message 
        });
    }
}


// update Questions by subjectId and courseId
exports.updateQuestion = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { courseId, subjectId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const subject = await Module.findById(subjectId);
                if(subject.userId.equals(userStatus._id)){
            const { question, options, correct_answer } = req.body;            
            const questionUpdate = await Question.findByIdAndUpdate(req.params.questionId, {
                question,
                options,
                correct_answer
            }, { new: true });
            return res.status(200).json({
                message: "Question successfully updated",
                questionUpdate
            }, { new: true });
        }else{
            return res.status(403).json({
                message: "The subject not found, likewise you are not owner of subject"
            })
        }
        } else {
            return res.status(403).json({
                message: "The course not found"
            })
        }
    }else{
        return res.status(401).json({
            Message: "You are not authorised to perform this action"
        })
    }
    } catch (error) {
        return res.status(400).json({
            message: "Error updating course",
            error: error.message 
        });
    }
}


// delete question by questionId
exports.deleteQuestion = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { courseId, subjectId, questionId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const subject = await Module.findById(subjectId);
                if(subject.userId.equals(userStatus._id)){
                    const questionDelete = await Question.findByIdAndDelete(questionId);
                    return res.status(200).json({
                        message: "Question successfully deleted",
                        questionDelete
                    }, { new: true });
            }else{
                return res.status(403).json({
                    message: "The subject not found, thus you are not owner of subject"
                })
            }
        }else{
            return res.status(403).json({
                message: "The Course not found"
            })
        }
    }else{
        return res.status(401).json({
            Message: "You are not authorised to perform this action"
        })
    }
}catch(error){
    return res.status(501).json({
        message: "Error deleting course",
        error: error.message 
    });
}}


// admin view all questions 
exports.viewQuestions = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { courseId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const questions = await Question.find({course: courseId});
                return res.status(200).json({
                    message: "Questions fetched successfully",
                    questions
                });
            }else{
                return res.status(403).json({
                    message: "The course not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "The course not found"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}


// review a course 
exports.reviewCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const { courseId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const { review, rating,  } = req.body;
                const courseReview = await Review.create({
                    review,
                    rating,
                    courseId: courseId,
                    userId: userStatus._id,
                })
                const newReview = await Course.findByIdAndUpdate(courseId, { $push: { reviews: courseReview } }, { new: true });
                return res.status(201).json({
                    message: "Course successfully reviewed",
                    newReview
                });
            }else{
                return res.status(403).json({
                    message: "The course not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "You must be a registered member to review"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error submitting review",
            error: error.message 
        });
    }}


// admin view all reviews
exports.viewReviews = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const reviews = await Review.find();
            return res.status(200).json({
                message: "Reviews fetched successfully",
                reviews
            });
        }else{
            return res.status(403).json({
                message: "The course not found"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}


// admin view all reviews 
exports.viewReviewsByCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const { courseId } = req.params;
            const courses = await Course.findById(courseId);
            if(courses){
                const reviews = await Review.find({courseId: courseId});
                return res.status(200).json({
                    message: "Reviews fetched successfully",
                    reviews
                });
            }else{
                return res.status(403).json({
                    message: "The course not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "You must be student to view this review"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}


// update the review by reviewId
exports.updateReview = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const { reviewId } = req.params;
            const reviews = await Review.findById(reviewId);
            if(reviews){
                const { review, rating } = req.body;
                const reviewUpdate = await Review.findByIdAndUpdate(reviewId, {
                    review,
                    rating
                }, { new: true });
                const newReview = await Course.findByIdAndUpdate(reviews.courseId, { $push: { reviews: reviewUpdate } }, { new: true });
                return res.status(200).json({
                    message: "Review successfully updated",
                    reviewUpdate,
                });
            }else{
                return res.status(403).json({
                    message: "The review not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "You must be admin to view this review"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error updating review",
            error: error.message 
        });
    }
}


// delete the review by reviewId

exports.deleteReview = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const { reviewId } = req.params;
            const reviews = await Review.findById(reviewId);
            if(reviews){
                const reviewDelete = await Review.findByIdAndDelete(reviewId);
                // delete review from the course reviews array
                const courseId = reviews.courseId;
                const course = await Course.findById(courseId);
                const courseReviews = course.reviews;
                const index = courseReviews.findIndex(review => review._id.equals(reviewId));
                courseReviews.splice(index, 1);
                const courseDelete = await Course.findByIdAndDelete(courseReviews);
                return res.status(200).json({
                    message: "Review successfully deleted",
                    reviewDelete,
                    courseDelete
                });
            }else{
                return res.status(403).json({
                    message: "The review not found"
                })
            }
        }else{
            return res.status(403).json({
                message: "You must be student or admin to delete this review"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: "Error deleting review",
            error: error.message 
        });
    }
}