const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Morning', 'Evening', 'Task Completed'],
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
