const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
    enum: ['😄 Happy', '😢 Sad', '🙂 Neutral', '😡 Angry', '🤩 Excited'],
    default: '🙂 Neutral',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for userId and date (one entry per user per day)
journalSchema.index({ userId: 1, date: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
journalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Journal', journalSchema);