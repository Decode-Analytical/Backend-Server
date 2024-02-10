const User = require("../models/user.model.js");
const Message = require("../models/message.model.js");
const { Course } = require("../models/course.model.js");

// create message
const createMessage = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.userId;

        if (!user) {
          return res.status(401).json({
            message: 'User not found'
          });
        }

    const { message } = req.body;
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = await Course.findOne({ _id: course._id, userId: userId })

    if (!isEnrolled) {
      return res.status(401).json({
        message: 'You are not enrolled in this course'
      });
    }

    // Create a new chat entry
    const newChat = new Message({ userId: user._id, message, name: user.firstName + ' ' + user.lastName, courseId: course._id });

    // Save the chat entry
    await newChat.save();

    return res.status(200). json({
      newChat: newChat
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};



// get message
async function getMessages(req, res) {
  try {
    const messages = await Message.find();

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error', message: error.message });
  }
}


//  update message a
async function updateMessage(req, res) {
  try {
    const user = req.user;
    const messageId = req.params.id;
    const { message } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, error: "User not authenticated" });
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, user: user._id },
      { $set: { message: message } },
      { new: true }
    );

    if (!message) {
      throw new Error("Message not found or user unauthorized");
    }

    return res.json({ success: true, message: "Message updated successfully", message: updatedMessage });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

//delete message
async function deleteMessage(req, res) {
  try {
    const user = req.user;
    const messageId = req.params.id;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const message = await Message.findOneAndDelete({
      _id: messageId, user: user._id,
    });

    if (!message) {
      throw new Error("Message not found or user unauthorized");
    }

    return res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { createMessage, getMessages, updateMessage, deleteMessage };
