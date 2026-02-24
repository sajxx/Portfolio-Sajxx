const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  heading: String,
  description: String
}, { _id: false });

const engineeringApproachSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  points: [pointSchema],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EngineeringApproach', engineeringApproachSchema);
