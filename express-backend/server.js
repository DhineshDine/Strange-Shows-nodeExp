
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression'); // ✅ Added compression
const fs = require('fs');
const path = require('path');


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


dotenv.config();

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const nowPlayingRoutes = require('./routes/nowPlayingRoutes'); // ✅ Make sure this matches your filename
const comingSoonRoutes = require('./routes/comingSoonRoutes');
const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');


const eventRoutes = require("./routes/eventRoutes")
const emailRoutes = require('./routes/emailRoutes');
const profileRoutes = require('./routes/profileRoutes'); // ✅ New line

// App Initialization
const app = express();

// ========================
// 🌐 Global Middlewares
// ========================

// ✅ JSON Body Parser
app.use(express.json());

// ✅ Compression (improves performance)
app.use(compression());

// ✅ CORS setup
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ Security Headers & Logger
app.use(helmet());
app.use(morgan('dev'));

// ✅ Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100 // limit IP per windowMs
});
app.use(limiter);

// ✅ Static uploads folder (serve image files)
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));


// ========================
// 🛣️ Routes
// ========================

// ✅ Auth Routes
app.use('/api/auth', authRoutes);

// ✅ Location Management Routes
app.use('/api/locations', locationRoutes);

// ✅ Coming Soon Movies Routes
app.use('/api/coming-soon', comingSoonRoutes);

// ✅ Now Playing Movies Routes
// Based on your nowPlayingRoutes.js structure, this endpoint serves all CRUD functions
app.use('/api/nowplaying', nowPlayingRoutes);

app.use('/uploads', express.static('uploads')); // To serve avatar images

app.use("/api/foods", foodRoutes);

app.use('/api/restaurants', restaurantRoutes);


app.use('/api/email', emailRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes); // ✅ Mount profile routes

// ========================
// ❗ 404 Handler (Fallback for unknown routes)
// ========================
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found!' });
});

// ========================
// ⚠️ Global Error Handler (Express 4)
// ========================
app.use((err, req, res, next) => {
    console.error('💥 Error:', err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// ========================
// 🌐 MongoDB & Server Start
// ========================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDBAndStartServer = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

connectDBAndStartServer();

