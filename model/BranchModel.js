// models/BranchModel.js (updated - simplified image storage as string path)
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
  officeType: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
  },
  branchImage: { 
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Branch', branchSchema);