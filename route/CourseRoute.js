
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const upload = require('../middleware/multer'); 

// Get all courses
router.post('/courses', upload.array('images', 10), courseController.createCourse);

router.get('/courses', courseController.getAllCourses );

// Get course by ID
router.get('/courses/:id', courseController.getCourseById);

// Update course by ID
router.put('/courses/:id', courseController.updateCourse);

// Delete course by ID
router.delete('/courses/:id', courseController.deleteCourse);

router.post('/set-featured', courseController.setFeaturedCourses);

router.get('/featured', courseController.getFeaturedCourses);

module.exports = router;