const mongoose = require("mongoose");


const aboutMeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    education: {
        type: String,
    },
    experience: {
        type: String,
    },
    skills: {
        type: String,
    },
    interest: {
        type: String
    },
    awards: {
        type: String
    },
    goals: {
        type: String
    },
    fields: {
        type: String
    }
},
{
    timestamps: true
})


module.exports = mongoose.model("AboutMe", aboutMeSchema);