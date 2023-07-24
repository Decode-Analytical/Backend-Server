const Course = require("../models/course.model");
const User = require("../models/user.model");
const Subject = require("../models/subject.model");
const Question = require("../models/question.model");




// create a course 
exports.createCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { title, description} = req.body;
            const newCourse = await Course.create({
                userId: userStatus._id,
                title,
                description,
            })
            return res.status(201).json({
                message: "Course registered successfully",
                newCourse
            })
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
            const courseId = await Course.findById(req.params.id);
            if(courseId){
                if(courseId.userId === userStatus._id){
                    const { title, description} = req.body;
                    const newCourse = await Course.findByIdAndUpdate(req.params.courseId, {
                        title,
                        description,
                    })
                    return res.status(201).json({
                        message: "Course registered successfully",
                        newCourse
                     });
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
            if(ownerId.userId === userStatus._id){
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
        if(userStatus.roles === "admin"){
            const courses = await Course.find();
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



// create subject 
exports.addSubject = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const courseId = await Course.findById(req.params.courseId);
            if(courseId){
            const { nameOfSubject, description, price, summary, category, language, objectives, requirement } = req.body;
            if(req.files){
                images = req.files.images,
                video = req.files.video,
                audio = req.files.audio
            const newSubject = await Subject.create({
                userId: userStatus._id,
                nameOfSubject,
                description, 
                price,
                summary,
                category,
                language,
                objectives,
                requirement,
                audio: audio,
                video: video,
                images: images
            })
            const addSubjectToCourse = await Course.findByIdAndUpdate({ _id: courseId._id}, {$push: {nameOfSubject: newSubject}}, { new: true})
            return res.status(201).json({
                message: "Subject registered successfully",
                addSubjectToCourse
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
            const subjectId = await Subject.findById(req.params.subjectId);
            if(subjectId){
                if(subjectId.userId === userStatus._id){
            const { nameOfSubject, description, price, summary, category, language, objectives, requirement  } = req.body;
            if(req.files){
                images = req.files.images,
                video = req.files.video,
                audio = req.files.audio        
            const subject = await Subject.findByIdAndUpdate(req.params.subjectId, {
                nameOfSubject, 
                description, 
                price,
                summary,
                category,
                language,
                objectives,
                requirement,
                audio: audio,
                video: video,
                images: images
            }, { new: true });
            return res.status(200).json({
                message: "Subject successfully updated",
                subject
            });
            } else {
                return res.status(400).json({ Error: "You are not the owner of this course" });
            }
            } else {
                return res.status(400).json({ error: "Course not found" });
            }
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to update a course" });
        }
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
            const subjects = await Subject.find();
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
            const subject = await Subject.findById(req.params.subjectId);
            if(subject){
                if(subject.userId === userStatus._id){
            const subjects = await Subject.findByIdAndDelete(req.params.subjectId);
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





// search course by first letter
exports.searchCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        const { title } = req.query;
        if (userStatus.roles === "admin") {
            const course = await Course.find({ title: { $regex: 'title', $options: "i"  } });
            return res.status(200).json({
                message: "Course fetched successfully",
                course
            });
        } else {
            return res.status(400).json({ error: "User must login as Admin in order to search a course" });
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
                const subject = await Subject.findById(subjectId);
                if(subject){
            const { question, choices, correctAnswer } = req.body;
            const newQuestion = await Question.create({
                question,
                choices,
                correctAnswer
            })
            const newSubject = await Subject.findByIdAndUpdate({ _id: subjectId}, {$push: {questions: newQuestion}}, { new: true})
            const courseleve = await Course.findByIdAndUpdate({ _id: courseId}, {$push: {subject: newSubject}}, { new: true})
            return res.status(201).json({
                message: "Question registered successfully",
                newQuestion,
                newSubject,
                courseleve
            })
            }else{
                return res.status(403).json({
                    message: "The subject not found"
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
                const subject = await Subject.findById(subjectId);
                if(subject.userId === userStatus._id){
            const { question, choices, correctAnswer } = req.body;            
            const questionUpdate = await Question.findByIdAndUpdate(req.params.questionId, {
                question,
                choices,
                correctAnswer
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
                const subject = await Subject.findById(subjectId);
                if(subject.userId === userStatus._id){
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
