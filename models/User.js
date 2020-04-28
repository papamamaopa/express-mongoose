const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 4,
    max: 12
  },
  lastName: {
    type: String,
    required: true,
    min: 4,
    max: 12
  },
  username: {
    type: String,
    required: true,
    min: 4,
    max: 8
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("users", userSchema);
