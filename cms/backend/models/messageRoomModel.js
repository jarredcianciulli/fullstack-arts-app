const mongoose = require('mongoose');

const messageRoomSchema = new mongoose.Schema({
  senderLead: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lead'
  },
  senderUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'MessageRoom'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const MessageRoom = mongoose.model('MessageRoom', messageRoomSchema);

module.exports = MessageRoom;
