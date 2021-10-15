const mongoose = require("mongoose");

let user = mongoose.Schema({
  FirstName: {
    type: String,
    min: 3,
    max: 20,
  },
  LastName: {
    type: String,
    min: 3,
    max: 20,
  },
  Email: {
    unique: true,
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("User", user);
