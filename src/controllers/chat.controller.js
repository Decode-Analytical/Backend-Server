const { Student } = require("../models/student.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);





// ...
exports.courseChat = async (req, res) => {
  try {
    const id = req.user;
const user = await User.findById(id);
const data = req.body;

// Assuming you have access to the 'io' instance
io.on('connection', (socket) => {
    console.log(`User connected: ${user.firstName}`);

    // Handle event from client
    socket.on('chat', (data) => {
        const { message, user } = data;
        console.log(`Message: ${message}`);

        // Emit event to all connected clients
        io.emit('chat', { message, user: user.firstName });
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${user.firstName}`);
    });
});

    // io.socket().emit("chat", { message, user: user.firstName + user.lastName });

    // Emit an event to notify clients about the new participant
    io.to(user.firstName + user.lastName).emit("user joined", {
      user: {
        name: user.firstName + user.lastName,
        profilePicture: user.picture,
      },
      message: `Joined the course chat.`,
    });

    return res.status(200).json({
      message: "Successfully joined the course chat.",
    });
  } catch (error) {
    console.error("Error checking student registration:", error);
    return res.status(500).json({ error: "Internal server error bb" });
  }
};
