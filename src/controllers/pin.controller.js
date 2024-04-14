const User = require('../models/user.model');
const Pin = require('../models/pin.models');
const Token = require('../models/token.model');
const sendEmail = require('../emails/email');


exports.createPin = async(req, res)=>{
    try {
        const id = req.user;
        const user = await User.findById(id);
        if (user.isBlocked === true) {
            return res.status(400).json({ message: 'You are blocked from transferring' });
        }
        const { pin } = req.body;
        const confirmPin = await Pin.findOne({ userId: user._id });
        if (confirmPin) {
            return res.status(400).json({ message: "Pin already exists, please use a forgot pin if you couldn't remember it" });
        }
        const newPin = await Pin.create({
            userId: user._id,
            pin: pin
        });
        return res.status(200).json({
            message: 'Pin created successfully',
            newPin
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
exports.updatePin = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (user.isBlocked === true) {
      return res
        .status(400)
        .json({ message: "You are blocked from transferring" });
    }
    const { pin, otp } = req.body;
    const confirmOtp = await Token.findOne({ userId: user._id, token: otp });
    if (!confirmOtp) {
      return res.status(400).json({ message: "invalid otp" });
    }
    const confirmPin = await Pin.findOne({ userId: user._id });
    if (!confirmPin) {
      return res.status(400).json({ message: "You have not created a pin" });
    }
    const deleteOtp = await Token.findOneAndDelete(
      { userId: user._id, token: otp },
      { new: true }
    );
    const updatePin = await Pin.findOneAndUpdate(
      { userId: user._id },
      { $set: { pin: pin } },
      { new: true }
    );
    return res.status(200).json({
      message: "Pin updated successfully",
      updatePin,
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while updating pin",
      message: error.message,
    });
  }
}


// reset pin
exports.forgotPin = async(req, res)=>{
    try {
        const { email }= req.body;
        const user = await User.findOne({ email });
        if (user.isBlocked === true) {
            return res.status(400).json({ message: 'You are blocked from transferring' });
        }
        const confirmPin = await Token.create({
            userId: user._id,
            token: Math.floor(100000 + Math.random() * 900000)
            });

            await sendEmail({
                email: user.email, 
                subject: 'Reset Pin Request', 
                message: `Your pin reset token is: ${confirmPin.token}`
            });
            return res.status(200).json({
                message: 'Pin requested successfully, Otp sent to your email',
                confirmPin
            });
        }catch (error) {
            return res.status(500).json({
                message: "internal server error",
                error: error.message
            })
        }
    }