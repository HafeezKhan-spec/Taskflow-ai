const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: String,
    required: [true, 'Please add an owner email'],
    trim: true,
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  source: {
    type: String,
    enum: ['Manual', 'Outlook', 'Salesforce', 'Monday'],
    default: 'Manual',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
