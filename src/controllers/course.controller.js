const Course = require("../models/course.model");
const User = require("../models/user.model");



exports.createCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin"){
        const { title, description, price, summary, category, language, objectives, requirement  } = req.body;    
        if(req.files){
            images = req.files.images,
            video = req.files.video,
            audio = req.files.audio  
        const course = await Course.create({
            userId: userStatus._id,
            title, 
            description, 
            price,
            summary,
            images: images,
            category,
            language,
            objectives,
            requirement,
            audio: audio,
            video: video,
        });
        return res.status(201).json({
            message: "Course successfully created",
            course
        })}
        }else{
            return res.status(401).json({ error: "User must login as Admin in order to create a course" });
        }
        } catch (error){
            return res.status(501).json({ 
                message: "Error creating course",
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




// update the courses

exports.updateCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            const { title, description, price, summary, category, language, objectives, requirement  } = req.body;
            if(req.files){
                images = req.files.images,
                video = req.files.video,
                audio = req.files.audio        
            const course = await Course.findByIdAndUpdate(req.params.id, {
                title, 
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
                message: "Course successfully updated",
                course
            });
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


// delete the course
exports.deleteCourse = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === "admin") {
            await Course.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                message: "Course successfully deleted",
            });
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
        const {tutor, category, title, ratings} = req.query

        let searchQuery = tutor
          ? { tutor }
          : category
          ? { category }
          : title
          ? { title }
          : ratings
          ? { ratings }
          : {};
          if (tutor) {
            const tutorInfo = await User.find({email: tutor.toLowerCase()}, "_id")
            searchQuery = {_id: tutorInfo._id};
          }
          const courses = await Course.find(searchQuery, {
            title: 1,
            tutor_id: 1,
            category: 1,
            comment_count: 1,
            like_count: 1,
            dislike_count: 1,
            likeAndDislikeUsers: 1,
          }).populate("tutor_id", "firstName lastName");
        
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

