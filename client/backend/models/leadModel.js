const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 20
  },
  email: {
    type: String,
    unique: true,
    max: 50
  },
  convertedToUser: {
    type: Boolean,
    default: false
  },
  testLead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Lead', leadSchema);
