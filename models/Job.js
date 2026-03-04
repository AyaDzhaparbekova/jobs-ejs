const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company is required"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected"],
    default: "applied",
  },
  salary: {
    type: Number,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);