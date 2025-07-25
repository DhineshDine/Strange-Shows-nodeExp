import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/default-profile.png');
  const [uploading, setUploading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/photo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUser = response.data.user;

      // Initialize wallet if not present
      if (!fetchedUser.walletInitialized) {
        await axios.put('/api/profile/wallet-init', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchedUser.walletAmount = 10000;
      }

      setUser(fetchedUser);
      setBio(fetchedUser.bio || '');
      setProfilePhoto(fetchedUser.profilePhoto || '/default-profile.png');

      // Calculate total spent on tickets and food
      const spent = (fetchedUser?.spendingHistory || []).reduce(
        (sum, entry) => sum + (entry.amount || 0),
        0
      );
      setTotalSpent(spent);

    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleBioSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile/bio', { bio }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error.message);
    }
  };
/*   profile upload  */
 const handleProfilePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('photo', file); // ✅ must match upload.single('photo')

  try {
    setUploading(true);
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    setProfilePhoto(response.data.profilePhoto); // ✅ use correct key
  } catch (err) {
    console.error('Profile photo upload failed:', err.message);
  } finally {
    setUploading(false);
  }
};

  if (loading) return <div className="text-center text-white mt-10 text-lg">Loading profile...</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-8">
        {/* Profile Photo */}
        <div className="relative group">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-[#1DB954] object-cover"
          />
          <label
            htmlFor="profile-photo-upload"
            className="absolute bottom-0 right-0 bg-[#1DB954] p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
            title="Upload new profile photo"
          >
            <FiPlus className="text-black text-xl" />
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              className="hidden"
            />
          </label>
          {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
        </div>

        {/* Name & Email */}
        <h1 className="text-3xl font-semibold">{user?.name || 'Unnamed User'}</h1>
        <p className="text-gray-400">{user?.email}</p>

        {/* Wallet and Insights */}
        <div className="flex gap-10 text-center">
          <div>
            <div className="text-2xl font-bold">₹{user?.walletAmount}</div>
            <div className="text-sm text-gray-400">Wallet Balance</div>
          </div>
          <div>
            <div className="text-2xl font-bold">₹{totalSpent}</div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
          <div>
            <div className="text-xl font-bold">{user?.recentActivity?.length || 0}</div>
            <div className="text-sm text-gray-400">Movies Watched</div>
          </div>
        </div>

        {/* Bio */}
        <div className="w-full max-w-2xl mt-6">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Bio</h2>
          {editingBio ? (
            <div className="mt-3 space-y-2">
              <textarea
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-gray-200"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleBioSave}
                  className="bg-[#1DB954] text-black font-medium px-4 py-2 rounded"
                >
                  Save
                </button>
                <button onClick={() => setEditingBio(false)} className="text-gray-400 hover:underline">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-gray-300 italic flex justify-between items-start">
              <p>{bio || `No bio set yet.`}</p>
              <button
                onClick={() => setEditingBio(true)}
                className="text-sm text-[#1DB954] hover:underline ml-4"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Favorite Films */}
        <div className="w-full max-w-5xl mt-10">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Favorite Movies</h2>
          <div className="flex gap-4 mt-4 overflow-x-auto scrollbar-hide pb-2">
            {user?.favoriteFilms?.length > 0 ? (
              user.favoriteFilms.map((film, idx) => (
                <img
                  key={idx}
                  src={film.posterUrl}
                  alt={film.title}
                  title={film.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No favorite movies added yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="w-full max-w-5xl mt-10">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Recently Watched</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {user?.recentActivity?.length > 0 ? (
              user.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1c1c] p-3 rounded-xl shadow-md hover:bg-[#262626] transition"
                >
                  <img
                    src={activity.posterUrl}
                    alt={activity.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="mt-2 text-sm text-gray-300">
                    {activity.description || `Watched: ${activity.title}`}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No recent activity yet.</p>
            )}
          </div>
        </div>

        {/* Ticket Collection */}
        <div className="w-full max-w-5xl mt-10">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Your Movie Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {user?.tickets?.length > 0 ? (
              user.tickets.map((ticket, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1c1c] p-4 rounded-xl shadow-md hover:bg-[#262626] transition"
                >
                  <h3 className="text-lg font-semibold text-[#1DB954]">{ticket.title}</h3>
                  <p className="text-sm text-gray-400">Showtime: {ticket.showtime}</p>
                  <p className="text-sm text-gray-400">Seats: {ticket.seats.join(', ')}</p>
                  <p className="text-sm text-gray-400">Date: {new Date(ticket.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">Booking ID: {ticket.bookingId}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No tickets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
