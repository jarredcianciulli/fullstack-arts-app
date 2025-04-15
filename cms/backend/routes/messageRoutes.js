const express = require('express');
const messageController = require('./../controllers/messageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save(err => {
    if (err) sendStatus(500);
    res.sendStatus(200);
  });
});
