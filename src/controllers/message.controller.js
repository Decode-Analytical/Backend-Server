const User = require("../models/user.model.js");
const Message = require("../models/message.model.js");

// create message
const createMessage = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.userId;

        if (!user) {
          throw new Error("User not authenticated");
        }

    const { message, name } = req.body;

    // Create a new chat entry
    const newChat = new Message({ userId: user._id, message, name: user.firstName + ' ' + user.lastName });

    // Save the chat entry
    await newChat.save();

    res.status(200). json({
      newChat: newChat
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};



// get message
async function getMessages(req, res) {
  try {
    const messages = await Message.find();

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


//  update message a
async function updateMessage(req, res) {
  try {
    const user = req.user;
    const messageId = req.params.id;
    const { updatedMessage } = req.body;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const message = await Message.findOneAndUpdate(
      { _id: messageId, user: user._id },
      { $set: { message: updatedMessage } },
      { new: true }
    );

    if (!message) {
      throw new Error("Message not found or user unauthorized");
    }

    res.json({ success: true, message: "Message updated successfully", updatedMessage: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { createMessage, getMessages, updateMessage, deleteMessage };
