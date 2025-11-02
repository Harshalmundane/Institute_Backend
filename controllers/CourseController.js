
const Course = require('../model/CourseModel');
const fs = require('fs');
const path = require('path');

exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseMode,
      courseDescription,
      batchStart,
      duration,
      curriculum,
      programStructure,
      isFeatured,
      facultyDetails,
      studentReviews,
      whatILearn // Optional field
    } = req.body;

    // Handle uploaded images as paths
    let courseImages = [];
    let studentReviewImages = [];

    if (req.files && req.files.length > 0) {
      // First image for course
      courseImages = [req.files[0].path];

      // Remaining images for student reviews
      studentReviewImages = req.files.slice(1).map(file => file.path);
    }

    const parsedFacultyDetails = JSON.parse(facultyDetails);
    const parsedStudentReviews = JSON.parse(studentReviews);

    const studentReviewsWithImages = parsedStudentReviews.map((review, index) => ({
      ...review,
      image: studentReviewImages[index] || '' // Match image with review, fallback empty string
    }));

    const newCourse = new Course({
      courseName,
      courseMode,
      courseDescription,
      courseImages, // Array with the first image path
      batchStart,
      duration,
      curriculum,
      facultyDetails: parsedFacultyDetails,
      studentReviews: studentReviewsWithImages,
      programStructure,
      whatILearn: whatILearn || '', // Handle optional field
      isFeatured: isFeatured === 'true'
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Error saving course' });
  }
};

// Set 3 featured courses
exports.setFeaturedCourses = async (req, res) => {
  try {
    const { courseIds } = req.body; // Expecting an array of 3 course IDs

    if (!Array.isArray(courseIds) || courseIds.length !== 3) {
      return res.status(400).json({ message: 'Please select exactly 3 courses.' });
    }

    // Reset all courses to not featured
    await Course.updateMany({}, { isFeatured: false });

    // Set selected courses to featured
    await Course.updateMany(
      { _id: { $in: courseIds } },
      { $set: { isFeatured: true } }
    );

    res.json({ message: 'Featured courses updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedCourses = async (req, res) => {
  try {
    const featuredCourses = await Course.find({ isFeatured: true });
    res.json(featuredCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle optional whatILearn if present
    if (updateData.whatILearn === undefined) {
      updateData.whatILearn = '';
    }

    // Handle new images if uploaded (optional for updates)
    if (req.files && req.files.length > 0) {
      const existingCourse = await Course.findById(req.params.id);
      if (existingCourse) {
        // Optional: Delete old course images
        existingCourse.courseImages.forEach(oldPath => {
          const fullPath = path.join(__dirname, '..', '..', oldPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });

        // Delete old student review images
        existingCourse.studentReviews.forEach(review => {
          if (review.image) {
            const fullPath = path.join(__dirname, '..', '..', review.image);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        });
      }

      // New course images (first one)
      updateData.courseImages = [req.files[0].path];

      // Update student reviews with new images (re-parse and assign)
      const parsedStudentReviews = JSON.parse(req.body.studentReviews || '[]');
      const newStudentReviewImages = req.files.slice(1).map(file => file.path);
      const studentReviewsWithImages = parsedStudentReviews.map((review, index) => ({
        ...review,
        image: newStudentReviewImages[index] || ''
      }));
      updateData.studentReviews = studentReviewsWithImages;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optional: Delete images from disk
    course.courseImages.forEach(oldPath => {
      const fullPath = path.join(__dirname, '..', '..', oldPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
    course.studentReviews.forEach(review => {
      if (review.image) {
        const fullPath = path.join(__dirname, '..', '..', review.image);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};