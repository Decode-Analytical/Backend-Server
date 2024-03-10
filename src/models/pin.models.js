const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    pin: {
        type: Number,
        required: true,
        unique: true,
        match: /^[0-9]+$/
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Pin", pinSchema);