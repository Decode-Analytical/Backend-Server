const User = require("../models/user.model");
const Tutor = require("../models/tutor.model");
const CommonService = require("../utils/commonService");
const Course = require("../models/course.model");

exports.addTutor = async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  try {
    //check if it is a valid user
    //check if user is a tutor
    //move user details to tutor details
    //add profile picture if needed
    const user_data = await User.findById(userId);
    console.log(user_data);
    if (!user_data) {
      throw new Error("User details not found");
    }
    if (user_data.tutor) {
      throw new Error("User is already a tutor");
    }
    const { firstName, lastName, email } = user_data;

    const updated_user = await User.findByIdAndUpdate(
      userId,
      {
        tutor: true,
      },
      { new: true }
    );

    const tutor_details = await Tutor.create({
      firstName,
      lastName,
      email,
      boi: "",
      userId: user_data._id,
    });
    return res.status(201).json({ status: true, data: tutor_details });
  } catch (error) {
    return CommonService.failureResponse(error.message, res);
  }
};

exports.allCourses = async (req, res, next) => {
  const userId = req.user.id;
  const tutor = await Tutor.findOne({ userId: userId });
  if (!tutor) {
    throw new Error("Tutor does not Exists");
  }
  console.log(tutor);
  const courses = tutor.courses;
  return res.status(200).json({ status: true, data: courses });
};

exports.addNewCourse = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const {
      title,
      summary,
      description,
      price,
      category,
      language,
      objectives,
      requirements,
    } = req.body;

    const tutor = await Tutor.findOne({ userId: userId });
    if (!tutor) {
      throw new error("Tutor does not exists");
    }
    const newCourse = await Course.create({
      title,
      summary,
      description,
      price,
      category,
      language,
      objectives,
      requirements,
      tutorId: tutor._id,
    });
    const updatedTutor = await Tutor.findOneAndUpdate(
      { _id: tutor._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({ status: true, msg: "Course Created" });
  } catch (error) {
    return CommonService.failureResponse(error.message, res);
  }
};

exports.removeCourse = async (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    const tutor = await Tutor.findOne({ userId: userId });
    if (!tutor) {
      throw new Error("Tutor not found");
    }
    const course_data = await Course.findByIdAndDelete(id);
    console.log(course_data);

    const tutor_updated = await Tutor.findOneAndUpdate(
      { _id: tutor._id },
      {
        $pull: {
          courses: id,
        },
      },
      { new: true }
    );

    console.log(tutor_updated);
    return res.status(200).json({ status: true, msg: "Course deleted" });
  } catch (error) {
    return CommonService.failureResponse(error.message, res);
  }
};

exports.updateCourse = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const {
    title,
    summary,
    description,
    price,
    category,
    language,
    objectives,
    requirements,
  } = req.body;

  try {
    const tutor = await Tutor.findOne({ userId: userId });

    if (!tutor) {
      throw new Error("Not registered as a tutor");
    }

    console.log({ tutor });

    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Course Not FOund");
    }

    console.log({ course });
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        description,
        price,
        category,
        language,
        objectives,
        requirements,
        tutorId: tutor._id,
      },
      {
        new: true,
      }
    );

    console.log(updatedCourse);
    return res.status(200).json({ status: true, data: updatedCourse });
  } catch (error) {
    return CommonService.failureResponse(error.message, res);
  }
};
