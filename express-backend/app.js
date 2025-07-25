const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const foodRoutes = require('./routes/foodRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');


const profileRoutes = require('./routes/profileRoutes');

const reviewRoutes = require('./routes/reviewRoutes');
const locationRoutes = require('./routes/locationRoutes');
const comingSoonRoutes = require("./routes/comingSoonRoutes");
const nowPlayingRoutes = require('./routes/nowPlayingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/locations', locationRoutes);
app.use("/api/comingsoon", comingSoonRoutes);
app.use('/api/nowplaying', nowPlayingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Alamo Drafthouse Backend!');
});

module.exports = app;
