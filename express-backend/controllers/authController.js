const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const path = require('path');
const fs = require('fs');

// ===================
// SIGNUP CONTROLLER
// ===================
exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'User',
      walletAmount: 10000,
      avatar: '/default-avatar.png'
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ===================
// LOGIN CONTROLLER
// ===================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        walletAmount: user.walletAmount,
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '/default-avatar.png'
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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
// UPDATE BIO
// ===================
exports.updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true }).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ===================
// UPLOAD AVATAR
// ===================
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath }, { new: true }).select('-password');

    res.json({ success: true, avatar: avatarPath });
  } catch (err) {
    console.error('Avatar Upload Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
