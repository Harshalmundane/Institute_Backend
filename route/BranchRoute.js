// routes/branchRoutes.js (updated)
const express = require('express');
const router = express.Router();

const upload = require('../middleware/multer'); // Updated import (no S3)
const {
  createBranch,
  getAllBranches,
  getBranchById,
  deleteBranch,
  setFeaturedBranches,
  getFeaturedBranches,
  updateBranch
} = require('../controllers/BranchController');

// Create a branch
router.post('/branch', upload.single('branchImage'), createBranch);

// Get all branches
router.get('/branches', getAllBranches);

router.put('/branch/:id', upload.single('branchImage'), updateBranch);

// Get featured branches — place this BEFORE /branch/:id route
router.get('/branch/featured', getFeaturedBranches);

router.get('/branch/:id', getBranchById);

// Delete a branch
router.delete('/branch/:id', deleteBranch);

// Set featured branches
router.post('/branch/set-featured', setFeaturedBranches);

module.exports = router;