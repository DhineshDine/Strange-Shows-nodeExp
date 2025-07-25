const express = require('express');
const router = express.Router();
const nowPlayingController = require('../controllers/nowPlayingController');
const NowPlayingMovie = require('../models/NowPlayingMovie');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===== Ensure Uploads Directory Exists =====
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created uploads directory at ${uploadDir}`);
}

// ===== Multer Setup =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const cleanName = file.originalname.replace(/\s+/g, '');
        const uniqueName = `${timestamp}-${cleanName}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, WEBP, or PNG images are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter
});

// ===== Middleware for Handling File Uploads with Multer Errors =====
const handleFileUpload = (req, res, next) => {
    upload.single('poster')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('⚠️ Multer error:', err);
            return res.status(400).json({
                success: false,
                message: `Multer Error: ${err.message}`
            });
        } else if (err) {
            console.error('⚠️ File upload error:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }
        next();
    });
};

// ===== Helper Function: Validate Movie Input =====
const validateMovieFields = (body, fileRequired = true) => {
    const {
        movieTitle,
        releaseDate,
        showTime,
        description,
        ticketPrice,
        directorName,
        cast,
        location,
        duration
    } = body;

    if (
        !movieTitle || !releaseDate || !showTime || !description ||
        !ticketPrice || !directorName || !cast || !location || !duration
    ) {
        return 'All fields are required.';
    }

    if (fileRequired && !body.poster && !body.file) {
        return 'Poster image is required.';
    }

    return null;
};

// ===== Routes =====

/**
 * @route   GET /
 * @desc    Get all now playing movies by location
 * @access  Public
 */
router.get('/all', async (req, res) => {
    const { location } = req.query;
  
    try {
      const query = {};
      if (location) {
        query.location = location;
      }
  
      const movies = await NowPlayingMovie.find(query);
  
      res.status(200).json({
        success: true,
        data: movies,
      });
    } catch (error) {
      console.error('Error fetching movies:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movies',
        error: error.message,
      });
    }
  });
  
/**
 * @route   POST /
 * @desc    Create a new now playing movie
 * @access  Admin
 */
router.post(
    '/',
    handleFileUpload,
    async (req, res) => {
        try {
            console.log("📦 Incoming POST /api/nowplaying request");
            console.log("BODY:", req.body);
            console.log("FILE:", req.file);

            // Ensure cast is always an array
            let cast = req.body.cast;
            if (!Array.isArray(cast)) {
                cast = cast ? [cast] : [];
            }

            const validationError = validateMovieFields({
                ...req.body,
                cast,
                poster: req.file?.filename
            }, true);

            if (validationError) {
                return res.status(400).json({ success: false, message: validationError });
            }

            const {
                movieTitle,
                releaseDate,
                showTime,
                description,
                ticketPrice,
                directorName,
                location,
                duration
            } = req.body;

            const newMovie = new NowPlayingMovie({
                movieTitle: movieTitle.trim(),
                releaseDate,
                showTime,
                description,
                ticketPrice: Number(ticketPrice),
                directorName,
                cast,
                location: location.trim(),
                duration: Number(duration),


                poster: req.file.filename
            });

            await newMovie.save();

            res.status(201).json({ success: true, message: 'Movie added successfully!', data: newMovie });
        } catch (error) {
            console.error('❌ Error adding movie:', error);
            res.status(500).json({ success: false, message: "Server error!" });
        }
    }
);

/**
 * @route   PUT /:id
 * @desc    Update an existing movie
 * @access  Admin
 */
router.put(
    '/:id',
    handleFileUpload,
    async (req, res, next) => {
        console.log(`📝 Incoming PUT /api/nowplaying/${req.params.id} request`);
        next();
    },
    nowPlayingController.updateNowPlayingMovie
);

/**
 * @route   DELETE /:id
 * @desc    Delete a movie
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Movie ID is required.' });
    }

    try {
        const deletedMovie = await NowPlayingMovie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return res.status(404).json({ success: false, message: 'Movie not found.' });
        }

        // Delete the associated poster file
        const posterPath = path.join(uploadDir, deletedMovie.poster);
        fs.unlink(posterPath, (err) => {
            if (err) {
                console.warn('⚠️ Poster image deletion failed:', err.message);
            } else {
                console.log('🗑️ Poster image deleted:', posterPath);
            }
        });

        res.json({ success: true, message: 'Movie deleted successfully.', data: deletedMovie });
    } catch (error) {
        console.error('❌ Error deleting movie:', error);
        res.status(500).json({ success: false, message: 'Failed to delete movie.' });
    }
});


router.get('/showtimes', async (req, res) => {
    try {
        const { movieTitle, location, date } = req.query;

        if (!movieTitle || !location || !date) {
            return res.status(400).json({ success: false, message: 'movieTitle, location, and date are required' });
        }

        const showtimes = await NowPlayingMovie.find({
            movieTitle,
            location,
            releaseDate: { $lte: new Date(date) } // optional filtering logic
        });

        if (!showtimes.length) {
            return res.status(404).json({ success: false, message: 'No showtimes found for the selected criteria.' });
        }

        res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
        console.error('❌ Error fetching showtimes:', error.message);
        res.status(500).json({ success: false, message: 'Server error fetching showtimes.' });
    }
});


module.exports = router;
