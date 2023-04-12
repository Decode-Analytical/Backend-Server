const Course = require("../models/courseModel");
const cloudinary = require("../utils/cloudinary");
//const Student = require('../models/studentModel');

// const { parse, stringify, toJSON, fromJSON } = require("flatted");
// const { findById } = require("../models/courseModel");

exports.addCourse = (async (req, res) => {
  try {
    const addCourse = await Course.create(req.body);
    res.json(addCourse);
  } catch (error) {
    console.log(error);
  }
});

exports.uploadVideos = (async (req, res) => {
  const { id } = req.params;

  let course = await Course.findById(id);

  const newVideoArray = course.video;

  if (req.files) {
    if (req.files.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        let result = await cloudinary.uploader.upload(
          req.files[i].path,
          {
            folder: "video",
            resource_type: "video",
          },
          (endresult) => {
            console.log(endresult);
          }
        );

        newVideoArray.push({
          name: req.files[i].originalname,
          url: result.url,
          cloudinary_id: result.public_id,
          description: req.body.description,
        });
      }
    }
    course.update({
      video: newVideoArray,
    });

    course.save();

    console.log('all saved?');
    res.json(course)

  } else {
    res.json("An error occured somewhere");
  }
});


exports.uploadAudios = (async (req, res) => {
  const { id } = req.params;
try{ 

  let course = await Course.findById(id);
 

  const newAudioArray = course.audio;
  

  if (req.files) {
    if (req.files.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        let result = await cloudinary.uploader.upload(
          req.files[i].path,
          {
            folder: "audio",
            resource_type: "video",
          },
          
        );

        newAudioArray.push({
          name: req.files[i].originalname,
          url: result.url,
          cloudinary_id: result.public_id,
          description: req.body.description,
        });
      }
    }
    course.update({
      audio: newAudioArray,
    });

    course.save();

    console.log('all saved?');
    res.json(course)

  }
}
  catch(error) {
    res.json(error);
  }
});

exports.uploadDocs = (async (req, res) => {
  const { id } = req.params;
try{ 

  let course = await Course.findById(id);
 

  const newDocsArray = course.docs;
  

  if (req.files) {
    if (req.files.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        let result = await cloudinary.uploader.upload(
          req.files[i].path,
          {
            folder: "docs",
            resource_type: "raw",
            
          },
          
        );

        newDocsArray.push({
          name: req.files[i].originalname,
          url: result.url,
          cloudinary_id: result.public_id,
          description: req.body.description,
        });
      }
    }
    course.update({
      audio: newDocsArray,
    });

    course.save();

    console.log('all saved?');
    res.json(course)

  }
}
  catch(error) {
    res.json(error);
  }
});

exports.uploadImage = (async (req, res) => {
  const { id } = req.params;
try{ 

  let course = await Course.findById(id);
 

  const newImageArray = course.image;
  

  if (req.files) {
    if (req.files.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        let result = await cloudinary.uploader.upload(
          req.files[i].path,
          {
            folder: "image",
            resource_type: "image",
            
          },
          
        );

        newImageArray.push({
          name: req.files[i].originalname,
          url: result.url,
          cloudinary_id: result.public_id,
          description: req.body.description,
        });
      }
    }
    course.update({
      audio: newImageArray,
    });

    course.save();

    console.log('all saved?');
    res.json(course)

  }
}
  catch(error) {
    res.json(error);
  }
});

exports.getCourseVideos = (async(req, res, next)=>{
  const {
    courseId
  } = req.params;

  const course = await Course.findById(courseId);
  if(!course){
    const error = new Error('Invalid Id');
    error.statusCode = 404;
    throw error; 
  }

  return res.status(200).json({status: true, data: course.video})
})

