// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const User = require('./userModel');
const Lead = require('./leadModel');
const MessageRoom = require('./messageRoomModel');

const messageSchema = new mongoose.Schema(
  {
    name: [
      {
        type: String,
        required: [true, 'Review can not be empty!']
      }
    ],
    senderUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    senderLead: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lead'
    },
    message: String,
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'MessageRoom'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'senderUser',
    select: 'name photo'
  });
  next();
});

messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'senderLead',
    select: 'name email'
  });
  next();
});

messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'room',
    select: 'id'
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
