const User = require('../models/user.js');
const path = require('path');
const fs = require('fs');

// ===================
// GET PROFILE
// ===================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Get Profile Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ===================
// UPDATE BIO, NAME, EMAIL
// ===================
exports.updateProfile = async (req, res) => {
  try {
    const { bio, name, email } = req.body;

    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { bio, name, email } },
      { new: true }
    ).select('-password');

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ===================
// UPLOAD PROFILE PHOTO
// ===================
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const profilePhotoPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: profilePhotoPath },
      { new: true }
    ).select('-password');

    res.json({ success: true, profilePhoto: profilePhotoPath });
  } catch (err) {
    console.error('Upload Photo Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ===================
// ADMIN: UPDATE USER ROLE
// ===================
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: "Unauthorized: Admins only" });
    }

    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Update Role Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
