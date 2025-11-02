
const Branch = require('../model/BranchModel');

const createBranch = async (req, res) => {
  try {
    const {
      branchName,
      officeType,
      address,
      mobile,
      email,
    } = req.body;

    // Ensure the file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Branch image is required' });
    }

    const newBranch = new Branch({
      branchName,
      officeType,
      address,
      mobile,
      email,
      branchImage: req.file.path, 
    });

    const savedBranch = await newBranch.save();
    res.status(201).json({ message: 'Branch created successfully', branch: savedBranch });
  } catch (error) {
    console.error('Create Branch Error:', error.message);
    res.status(500).json({ error: 'Server error while creating branch' });
  }
};

const setFeaturedBranches = async (req, res) => {
  try {
    const { branchIds } = req.body;

    if (!Array.isArray(branchIds) || branchIds.length !== 3) {
      return res.status(400).json({ message: 'Please select exactly 3 branches.' });
    }

    await Branch.updateMany({}, { isFeatured: false });
    await Branch.updateMany(
      { _id: { $in: branchIds } },
      { $set: { isFeatured: true } }
    );

    res.json({ message: 'Featured branches updated successfully.' });
  } catch (err) {
    console.error('Set Featured Branches Error:', err.message);
    res.status(500).json({ error: 'Server error while setting featured branches' });
  }
};

const getFeaturedBranches = async (req, res) => {
  try {
    const featuredBranches = await Branch.find({ isFeatured: true });
    res.json(featuredBranches);
  } catch (err) {
    console.error('Get Featured Branches Error:', err.message);
    res.status(500).json({ error: 'Server error while fetching featured branches' });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.status(200).json(branches);
  } catch (error) {
    console.error('Fetch Branches Error:', error);
    res.status(500).json({ error: 'Server error while fetching branches' });
  }
};

const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.status(200).json(branch);
  } catch (error) {
    console.error('Fetch Single Branch Error:', error);
    res.status(500).json({ error: 'Server error while fetching branch' });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Optional: Delete the image file from disk
    if (branch.branchImage) {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, '..', '..', branch.branchImage); // Adjust path based on your project structure
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Branch.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete Branch Error:', error);
    res.status(500).json({ error: 'Server error while deleting branch' });
  }
};

const updateBranch = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle new image upload if provided (optional for updates)
    if (req.file) {
      // Optional: Delete old image from disk
      const existingBranch = await Branch.findById(req.params.id);
      if (existingBranch && existingBranch.branchImage) {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, '..', '..', existingBranch.branchImage);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      updateData.branchImage = req.file.path;
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(updatedBranch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Exporting all functions cleanly
module.exports = {
  createBranch,
  setFeaturedBranches,
  getFeaturedBranches,
  getAllBranches,
  getBranchById,
  deleteBranch,
  updateBranch
};