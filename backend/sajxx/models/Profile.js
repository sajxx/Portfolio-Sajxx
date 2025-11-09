const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  label: String,
  url: String,
  icon: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Your Name'
  },
  role: {
    type: String,
    default: 'Full Stack Engineer'
  },
  headline: String,
  about: String,
  location: String,
  email: String,
  phone: String,
  socials: [socialSchema],
  resumeUrl: String,
  heroImage: String,
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
