const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const NowPlayingMovie = require('../models/NowPlayingMovie');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure upload folder exists
const fs = require('fs');
const uploadPath = 'uploads/profile-photos';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

/**
 * GET /api/profile
 * Fetch full user profile
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('favoriteFilms')
      .populate('recentActivity')
      .select('-password')
      .lean();

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/profile/bio
 * Update user bio
 */
router.put('/bio', authMiddleware, async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Bio updated', bio: user.bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/photo
 * Upload profile photo
 */
router.post('/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const photoPath = `/uploads/profile-photos/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePhoto: photoPath },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile photo updated', profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/favorites
 * Add a movie to favoriteFilms
 */
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const movieExists = await NowPlayingMovie.findById(movieId);
    if (!movieExists) return res.status(404).json({ message: 'Movie not found' });

    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { favoriteFilms: movieId } }
    );
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/recent
 * Add a movie to recentActivity (max 10)
 */
router.post('/recent', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const movieExists = await NowPlayingMovie.findById(movieId);
    if (!movieExists) return res.status(404).json({ message: 'Movie not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.recentActivity = user.recentActivity.filter(
      (id) => id.toString() !== movieId
    );
    user.recentActivity.unshift(movieId);

    if (user.recentActivity.length > 10) {
      user.recentActivity = user.recentActivity.slice(0, 10);
    }

    await user.save();
    res.json({ message: 'Added to recent activity' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/profile/wallet-init
 * Initialize wallet to ₹10,000
 */
router.put('/wallet-init', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.walletAmount == null) {
      user.walletAmount = 10000;
      await user.save();
      return res.json({ message: 'Wallet initialized with ₹10,000', walletAmount: user.walletAmount });
    } else {
      return res.json({ message: 'Wallet already initialized', walletAmount: user.walletAmount });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/wallet-topup
 * Add money to wallet
 */
router.post('/wallet-topup', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid top-up amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { walletAmount: amount } },
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `Wallet topped up by ₹${amount}`, walletAmount: user.walletAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/profile/tickets
 * Add ticket to user and deduct from wallet
 */
router.post('/tickets', authMiddleware, async (req, res) => {
  try {
    const { title, showtime, seats, posterUrl, bookingId, amountSpent } = req.body;

    if (!title || !showtime || !seats || !bookingId) {
      return res.status(400).json({ message: 'Missing required ticket info' });
    }

    if (typeof amountSpent !== 'number' || amountSpent < 0) {
      return res.status(400).json({ message: 'Invalid amountSpent value' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.walletAmount || 0) < amountSpent) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const ticket = {
      title,
      showtime,
      seats,
      posterUrl,
      bookingId,
      date: new Date()
    };

    user.tickets.push(ticket);
    user.totalSpent = (user.totalSpent || 0) + amountSpent;
    user.walletAmount -= amountSpent;

    await user.save();

    res.json({ message: 'Ticket added to history', walletAmount: user.walletAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
