const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller.js");
const { auth } = require("../middleware/auth.js");

router.use(auth);

// Route for creating a new message
router.post("/messages", messageController.createMessage);

// Route for fetching and displaying messages
router.get("/messages", messageController.getMessages);

// Route for updating a message
router.put("/messages/:id", messageController.updateMessage);

// Route for deleting a message
router.delete("/messages/:id", messageController.deleteMessage);

module.exports = router;
