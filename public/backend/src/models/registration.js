const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  lessonPackage: {
    type: Object,
    required: true
  },
  preferredLocation: {
    type: Object,
    required: true
  },
  preferredSchedule: {
    type: Object,
    required: true
  },
  additionalNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
