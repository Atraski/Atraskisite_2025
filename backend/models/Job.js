const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  whatsapp: String,
  message: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", JobSchema);
