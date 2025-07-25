const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model

// Middleware to verify JWT and attach full user data to req.user
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Bearer token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user details from DB
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Attach full user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      walletAmount: user.walletAmount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
req.userId = user._id; // ✅ Add this line

    next();
  } catch (err) {
    console.error('Token Verification Error:', err.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
