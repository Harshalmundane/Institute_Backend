// models/Course.js (updated - simplified image storage as string paths)
const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  feature: { type: String, required: true },
  educator: { type: String, required: true },
});

const StudentReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  image: { type: String }, 
});

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseMode: { type: String, required: true },
  courseDescription: { type: String, required: true },
  batchStart: { type: Date, required: true },
  duration: { type: String, required: true },
  curriculum: { type: String, required: true },
  facultyDetails: { type: [FacultySchema], required: true },
  studentReviews: { type: [StudentReviewSchema], required: true },
  programStructure: { type: String, required: true },
  courseImages: [String], 
  whatILearn: { type: String }, 
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;