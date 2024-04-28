const User = require('../models/user.model');
const AboutMe = require('../models/aboutme.model');



exports.createAboutMe = async (req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        const aboutMeExist = await AboutMe.findOne({userId: user._id});
        if(aboutMeExist){
            return res.status(400).json({ message: "Your About me already exists, but can be updated" });
        }
        if(user.roles.includes('admin') || user.roles.includes('superadmin')){
            const { education, experience, skills, goals, interest, awards, fields } = req.body;
            const aboutMe = await AboutMe.create({
                userId: user._id,
                education,
                experience,
                skills,
                goals,
                interest,
                awards,
                fields
            });
            return res.status(201).json({
                message: "Your About me created successfully",
                data: aboutMe
            });
        }else{
            return res.status(401).json({
                message: "You are not authorized to create about me"
            });
        }

    }catch(error){
        return res.status(500).json({
            message: "Failed to create about me",
            error: error.message
        });
    }
}


exports.getAboutMe = async( req, res )=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if(user.roles.includes('admin') || user.roles.includes('superadmin') || user.roles.includes('student')){
            const aboutMe = await AboutMe.findOne({userId: user._id});
            return res.status(200).json({
                message: "Your About me fetched successfully",
                data: aboutMe
            });
        }else{
            return res.status(401).json({
                message: "You are not authorized to view about me"
            });
        }
    }catch(error){
        return res.status(500).json({
            message: "Failed to get about me",
            error: error.message
        });
    }
}


exports.updateAboutMe = async(req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if(user.roles.includes('admin') || user.roles.includes('superadmin')){
            const { education, experience, skills, goals, interest, awards, fields } = req.body;
            const aboutMe = await AboutMe.findOne({userId: user._id});
            if(aboutMe){
                const updated = await AboutMe.findOneAndUpdate({
                    userId: user._id
                },
                {
                    $set: {
                        education,
                        experience,
                        skills,
                        goals,
                        interest,
                        awards,
                        fields
                    }
                },
                {
                    new: true
                }
                );
                return res.status(200).json({
                    message: "About me updated successfully",
                    data: updated
                });
            }else{
                return res.status(404).json({
                    message: "Your About me does not exist"
                });
            }
        }
    }catch(error){
        return res.status(500).json({
            message: "failed to update about me",
            error: error.message
    })
}
}

exports.deleteAboutMe = async(req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if(user.roles.includes('admin') || user.roles.includes('superadmin')){
            const aboutMe = await AboutMe.findOne({userId: user._id});
            if(aboutMe){
                await AboutMe.findOneAndDelete({userId: user._id});
                return res.status(200).json({
                    message: "About me deleted successfully"
                });
            }else{
                return res.status(404).json({
                    message: "Your About me does not exist"
                })
            }
    }
}catch(error){
    return res.status(500).json({
        message: "Failed to delete about me",
        error: error.message
    });
}
}