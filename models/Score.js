const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Nickname is required'],
    trim: true,
    minlength: 2,
    maxlength: 20
  },

  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },

  time: {
    type: String,
    required: [true, 'Time is required'],
    match: [/^\d{2}:\d{2}$/, 'Time must be in format MM:SS']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  }
});

module.exports = mongoose.model('Score', scoreSchema);