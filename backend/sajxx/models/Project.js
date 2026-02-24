const mongoose = require('mongoose');

const engineeringDecisionSchema = new mongoose.Schema({
  title: String,
  description: String
}, { _id: false });

const metricSchema = new mongoose.Schema({
  label: String,
  value: String
}, { _id: false });

const architectureSchema = new mongoose.Schema({
  frontend: String,
  backend: String,
  authentication: String,
  database: String,
  deployment: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String
  },
  technologies: [{
    type: String
  }],
  images: [{
    type: String
  }],
  githubLink: String,
  liveLink: String,
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'other'],
    default: 'web'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  problem: String,
  architecture: architectureSchema,
  engineeringDecisions: [engineeringDecisionSchema],
  scalingConsiderations: [String],
  metrics: [metricSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);