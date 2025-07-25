const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Default role
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },

  // Wallet logic: ₹10,000 reward by default
  walletAmount: { type: Number, default: 10000 },

  // Total spent tracker (used for insights)
  totalSpent: { type: Number, default: 0 },

  // Bio and profile photo
  bio: { type: String, default: '' },
  profilePhoto: { type: String, default: '/default-profile.png' },

  // Favorite Films (referenced from NowPlayingMovie)
  favoriteFilms: [{ type: Schema.Types.ObjectId, ref: 'NowPlayingMovie' }],

  // Recent activity (referenced from NowPlayingMovie)
  recentActivity: [{ type: Schema.Types.ObjectId, ref: 'NowPlayingMovie' }],

  // Ticket Collection (snapshot data)
  tickets: [
    {
      title: String,
      showtime: String,
      seats: [String],
      date: Date,
      bookingId: String,
      posterUrl: String
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('User', UserSchema);
