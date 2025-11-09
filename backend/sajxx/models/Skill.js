const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'advanced'
  },
  category: {
    type: String,
    default: 'general'
  },
  iconUrl: String,
  description: String,
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
