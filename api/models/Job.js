const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name."],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, "Please provide position offered."],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ["interview", "delcined", "pending"],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user."]
    }
}, {timestamps: true});


module.exports = mongoose.model("Job", JobSchema)