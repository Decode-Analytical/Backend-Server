const User = require('../models/user.model');
const Pin = require('../models/pin.models');


exports.createPin = async(req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if (user.isBlocked === true) {
            return res.status(400).json({ message: 'You are blocked from transferring' });
        }
        const { pin } = req.body;
        const confirmPin = await Pin.findOne({ userId: user._id, pin });
        if (confirmPin) {
            return res.status(400).json({ message: 'Pin already exists' });
        }
        const newPin = new Pin({
            userId: user._id,
            pin: req.body.pin
        });
        const savedPin = await newPin.save();
        return res.status(200).json({
            message: 'Pin created successfully',
            savedPin
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'An error occurred while creating pin',
            message: error.message
        });
    }
}

// update the pin 
exports.updatePin = async(req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if (user.isBlocked === true) {
            return res.status(400).json({ message: 'You are blocked from transferring' });
        }
        const { pin } = req.body;
        const confirmPin = await Pin.findOne({ userId: user._id });
        if (!confirmPin) {
            return res.status(400).json({ message: 'You have not created a pin' });
        }
        const updatePin = await Pin.findOneAndUpdate({ userId: user._id }, req.body, { new: true });
        return res.status(200).json({
            message: 'Pin updated successfully',
            updatePin
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'An error occurred while updating pin',
            message: error.message
        });
    }
}