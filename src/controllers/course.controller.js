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
            const { title, price, paid, description} = req.body;
            const existingTitle = await Course.findOne({ title });
            if(!existingTitle){
            const newCourse = await Course.create({
                userId: userStatus._id,
                title,
                price,
                description,
                paid
            })
            return res.status(201).json({
                message: "Course registered successfully",
                newCourse
            })
        } else{
            return res.status(301).json({
                message: "The title of the course is existing, kindly choose topic/subject under it"
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
                    const { title, paid, description} = req.body;
                    const newCourse = await Course.findByIdAndUpdate(req.params.courseId, {
                        title,
                        description,
                        paid
                    },
                    {
                        new: true
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
            if(`${ownerId.userId}` === `${userStatus._id}`){
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
        if(userStatus.roles === "admin" || "student"){
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
            const { modules, description, summary, category, language, requirement } = req.body;
            if(req.files){
                images = req.files.images,
                video = req.files.video,
                audio = req.files.audio
            const newSubject = await Subject.create({
                userId: userStatus._id,
                modules,
                description,
                summary,
                category,
                language,
                requirement,
                audio: audio,
                video: video,
                images: images
            })
            const addSubjectToCourse = await Course.findByIdAndUpdate({ _id: courseId._id}, {$push: { modules: newSubject}}, { new: true})
            return res.status(201).json({
                message: "Subject registered successfully",
                addSubjectToCourse,
                newSubject
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
                if(`${subjectId.userId}` === `${userStatus._id}`){
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
            await Course.findByIdAndUpdate(req.params.courseId, { $set: { nameOfSubject: subject }}, {new: true })
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
                if(`${subject.userId}` === `${userStatus._id}`){
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

// // search course by title or category
// exports.searchCourse = async (req, res) => {
//     try {
//         const title= req.query
//         const course = await Course.find({title: { $regex: `${title}`, $options: "i" }})
//         return res.status(200).json({
//             message: "Course fetched successfully",
//             course
//             });       
//     } catch (error) {
//         return res.status(400).json({
//             message: "Error fetching course",
//             error: error.message 
//         });
//     }
// }

// search course by title or category
exports.searchCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const {category, title} = req.query

        //established and create the searching variable
        let searchQuery =  category
          ? { category: { $regex: category, $options: "i" } }
          : title
          ? {  title: { $regex: title, $options: "i" } }
          : {}; // if nothing is specified, all courses will be returned

          const courses = await Course.find(searchQuery)
            .sort({ createdAt: -1 })

          return res.status(200).json({
            message: "success",
            courses,
          });
       
    } 
    catch (error) {
        return res.status(500).json({
            message: "Error fetching course",
            error: error.message 
        });
    }
}

// searching courses using query 




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
                if(`${subject.userId}` === `${userStatus._id}`){
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
                if(`${subject.userId}` === `${userStatus._id}`){
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