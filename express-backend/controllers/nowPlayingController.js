const NowPlayingMovie = require('../models/NowPlayingMovie');
const path = require('path');
const fs = require('fs');

// ===== GET all now playing movies (no location filter) =====
const getNowPlayingMovies = async (req, res) => {
    try {
        // Fetch all movies from the database
        const movies = await NowPlayingMovie.find();

        if (!movies.length) {
            return res.status(404).json({
                success: false,
                message: 'No movies found.'
            });
        }

        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (err) {
        console.error('❌ Error fetching movies:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to fetch now playing movies.'
        });
    }
};

// ===== POST a new now playing movie =====
const createNowPlayingMovie = async (req, res) => {
    try {
        const {
            movieTitle,
            description,
            releaseDate,
            showTime,
            ticketPrice,
            directorName,
            cast,
            location, 
            duration
        } = req.body;

        // === Validate Required Fields ===
        if (!movieTitle || !releaseDate || !showTime || !ticketPrice || !location ||  !duration || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: movieTitle, releaseDate, showTime, ticketPrice, location, duriation, poster'
            });
        }

        // === Handle Cast (comma-separated string to array) ===
        const castArray = cast
            ? cast.split(',').map(name => name.trim())
            : [];

        // === Create New Movie ===
        const newNowPlayingMovie = new NowPlayingMovie({
            movieTitle: movieTitle.trim(),
            description: description?.trim() || '',
            releaseDate,
            showTime,
            ticketPrice: Number(ticketPrice),
            directorName: directorName?.trim() || '',
            cast: castArray,
            location: location.trim(),
            duration: Number(duration),

            poster: req.file.filename
        });

        const savedMovie = await newNowPlayingMovie.save();

        res.status(201).json({
            success: true,
            message: 'New movie added successfully',
            data: savedMovie
        });
    } catch (error) {
        console.error('❌ Error creating movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to add movie.'
        });
    }
};

// ===== DELETE a now playing movie =====
const deleteNowPlayingMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await NowPlayingMovie.findById(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // === Delete Poster File ===
        if (movie.poster) {
            const posterPath = path.join(__dirname, '../uploads', movie.poster);
            fs.unlink(posterPath, (err) => {
                if (err) {
                    console.warn(`⚠️ Failed to delete poster file: ${err.message}`);
                } else {
                    console.log(`🗑️ Poster deleted: ${movie.poster}`);
                }
            });
        }

        await movie.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to delete movie.'
        });
    }
};

// ===== UPDATE a now playing movie =====
const updateNowPlayingMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            movieTitle,
            description,
            releaseDate,
            showTime,
            ticketPrice,
            directorName,
            cast,
            location,
            duration
        } = req.body;

        // === Handle Cast (comma-separated string to array) ===
        const castArray = cast
            ? cast.split(',').map(name => name.trim())
            : [];

        // === Prepare Update Data ===
        const updateData = {
            movieTitle: movieTitle?.trim(),
            description: description?.trim(),
            releaseDate,
            showTime,
            ticketPrice: ticketPrice ? Number(ticketPrice) : undefined,
            directorName: directorName?.trim(),
            cast: castArray,
            location: location?.trim(),
            duration: duration ? Number(duration) : undefined
        };

        // === Handle Poster Replacement ===
        if (req.file) {
            updateData.poster = req.file.filename;

            const existingMovie = await NowPlayingMovie.findById(id);

            if (existingMovie && existingMovie.poster) {
                const oldPosterPath = path.join(__dirname, '../uploads', existingMovie.poster);
                fs.unlink(oldPosterPath, (err) => {
                    if (err) {
                        console.warn(`⚠️ Failed to delete old poster: ${err.message}`);
                    } else {
                        console.log(`🗑️ Old poster deleted: ${existingMovie.poster}`);
                    }
                });
            }
        }

        // === Update Movie ===
        const updatedMovie = await NowPlayingMovie.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            data: updatedMovie
        });
    } catch (error) {
        console.error('❌ Error updating movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to update movie.'
        });
    }
};

// ===== EXPORT CONTROLLERS =====
module.exports = {
    getNowPlayingMovies,      // Updated function without location filtering!
    createNowPlayingMovie,
    deleteNowPlayingMovie,
    updateNowPlayingMovie
};
