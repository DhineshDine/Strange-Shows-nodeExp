const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require('../models/user');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// ✅ Get user profile
router.get('/profile', verifyToken, (req, res) => {
  const { _id, email, role, walletAmount, bio, avatar } = req.user;
  res.json({
    success: true,
    user: { _id, email, role, walletAmount, bio, avatar },
  });
});

// ✅ Update user profile (e.g., bio)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    console.error('Update Bio Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update bio' });
  }
});

// ✅ Set up Multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + ext); // Use user ID as filename
  }
});

const upload = multer({ storage });

// ✅ Upload avatar
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    console.error('Upload Avatar Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
});

// Admin routes
router.get('/admin/dashboard', verifyToken, roleMiddleware(['Admin']), (req, res) => {
  res.json({ success: true, message: 'Welcome to Admin Dashboard' });
});

router.get('/user/profile', verifyToken, roleMiddleware(['User', 'Admin']), (req, res) => {
  res.json({ success: true, message: `Welcome ${req.user.email}`, user: req.user });
});

module.exports = router;
