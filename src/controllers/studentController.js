import asyncHandler from 'express-async-handler';

import Student from '../models/studentModel.js';

// GET A SINGLE COURSE BY ID
export const getCourse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const course = await Student.findById(id).populate('user', 'name email');

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
});

// TO ENROL A COURSE
export const createCourse = asyncHandler(async (req, res) => {
  const { orderCourses, description, price, paymentMethod } = req.body;

  if (orderCourses && orderCourses.length === 0) {
    res.status(400);
    throw new Error('You are presently not enrolled for any course yet');
  } else {
    const course = new Student({
      orderCourses,
      user: req.user_id,
      price,
      description,
      paymentMethod,
      totalprice,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  }
});

// STUDENT LOGIN COURSES
export const studentLoginCourse = asyncHandler(async (req, res) => {
  const courses = await Student.find({ user: req.user.id }).sort({ id: -1 });

  res.json(courses);
});

// COURSE IS PAID
export const paidCourse = asyncHandler(async (req, res) => {
  const { id, status, update_time, email_address } = req.body;
  const course = await Student.findById(req.params.id);

  if (course) {
    course.isPaid = true;
    course.paidAt = Date.now();
    course.paymentResult = {
      id: id,
      status: status,
      update_time: update_time,
      email_address: email_address,
    };

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
});


//TO ADD POINTS TO A USER
export const addPoint = asyncHandler(async(req, res, next)=>{
  const { id } = req.params;
  const student_data = await Student.findById(id);
  if(!student_data){
    return res.status(404).json({status: false, message: "Invalid User Id"});
  }

  student_data.points += 10;
  const student_data_saved = await student_data.save();
  return res.status(200).json({status: true, message: "Point Added", data: student_data_saved})
})
