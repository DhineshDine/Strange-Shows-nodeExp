import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const NowPlayingBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {};

  const [showtimesByDate, setShowtimesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [availableLocations, setAvailableLocations] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const [bookedSeats] = useState([]); // Example: []
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch locations for movie
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/nowplaying/all');
        const allMovies = response.data.data;
        const matchedMovies = allMovies.filter(m => m.movieTitle === movie.movieTitle);
        const uniqueLocations = [...new Set(matchedMovies.map(m => m.location))];
        setAvailableLocations(uniqueLocations);
        if (!selectedLocation && uniqueLocations.length > 0) {
          setSelectedLocation(uniqueLocations[0]);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    if (movie?.movieTitle) fetchLocations();
  }, [movie]);

  // Fetch showtimes by date
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie?.movieTitle || !selectedLocation) return;

      const datePromises = [0, 1, 2].map(async offset => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        const dateStr = date.toISOString().split('T')[0];
        try {
          const res = await axios.get('http://localhost:5000/api/nowplaying/showtimes', {
            params: {
              movieTitle: movie.movieTitle,
              location: selectedLocation,
              date: dateStr,
            },
          });
          return { dateStr, times: res.data.data.map(m => m.showTime) };
        } catch {
          return { dateStr, times: [] };
        }
      });

      const results = await Promise.all(datePromises);
      const dateMap = {};
      results.forEach(({ dateStr, times }) => (dateMap[dateStr] = times));
      setShowtimesByDate(dateMap);
    };

    fetchShowtimes();
  }, [movie?.movieTitle, selectedLocation]);

  // Update visible showtimes for selected date
  useEffect(() => {
    if (showtimesByDate[selectedDate]) {
      setShowtimes(showtimesByDate[selectedDate]);
    } else {
      setShowtimes([]);
    }
  }, [selectedDate, showtimesByDate]);

  const generateDateButtons = () =>
    [0, 1, 2].map(offset => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const dateStr = date.toISOString().split('T')[0];
      const label =
        offset === 0
          ? `Today (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`
          : offset === 1
          ? `Tomorrow (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`
          : `${date.toLocaleDateString(undefined, {
              weekday: 'long',
            })} (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
      const hasShowtimes = showtimesByDate[dateStr]?.length > 0;
      return (
        <button
          key={offset}
          disabled={!hasShowtimes}
          className={`px-3 py-1 rounded transition ${
            selectedDate === dateStr
              ? 'text-yellow-500 font-semibold'
              : hasShowtimes
              ? 'text-gray-300 hover:text-yellow-500'
              : 'text-gray-600 cursor-not-allowed'
          }`}
          onClick={() => hasShowtimes && setSelectedDate(dateStr)}
        >
          {label}
        </button>
      );
    });

  const isBooked = index => bookedSeats.includes(index);
  const isSelected = index => selectedSeats.includes(index);
  const toggleSeat = index => {
    if (isBooked(index)) return;
    setSelectedSeats(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const renderSeats = () => {
    const layout = [
      '000000000000',
      '111111111111',
      '111111111111',
      '11111d111111',
      '1wcc1111ccw1',
      '11d111d11111',
      '111011111101',
      '110111111011',
      '111111111111',
    ];
    let seatIndex = 0;
    return layout.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-2 mb-2">
        {row.split('').map((type, colIndex) => {
          if (type === '0') return <div key={colIndex} className="w-6 h-6" />;
          const index = seatIndex++;
          const baseClass = "w-6 h-6 rounded-full transition";
          const stateStyle = isBooked(index)
            ? "bg-gray-600 cursor-not-allowed"
            : isSelected(index)
            ? "bg-yellow-500"
            : "bg-white hover:bg-yellow-300";
          const extraStyle =
            type === 'w'
              ? 'border-2 border-blue-400'
              : type === 'c'
              ? 'bg-green-300'
              : type === 'd'
              ? 'bg-gray-400 pointer-events-none'
              : '';
          return (
            <button
              key={colIndex}
              onClick={() => toggleSeat(index)}
              disabled={isBooked(index) || type === 'd'}
              className={`${baseClass} ${stateStyle} ${extraStyle}`}
              title={`Seat ${index + 1}`}
            />
          );
        })}
      </div>
    ));
  };
const calculateTotal = () => {
  const ticketPrice = parseFloat(movie?.ticketPrice || 0);
  const base = selectedSeats.length * ticketPrice;
  const fee = selectedSeats.length * 1.5;
  const tax = Math.min(30, (base + fee) * 0.1); // Cap tax at ₹30
  return (base + fee + tax).toFixed(2);
};

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="text-center py-6 border-b border-yellow-500">
        <h1 className="text-4xl font-bold text-yellow-500">SHOWTIMES</h1>
      </div>

      <div className="flex flex-col md:flex-row p-8">
        {/* LEFT */}
        <div className="md:w-1/2 p-4">
          <h2 className="text-3xl font-bold">{movie?.movieTitle}</h2>
          <p className="text-gray-400 mt-2">
            {movie?.duration || 'N/A'} min • {new Date(movie?.releaseDate).toLocaleDateString()} •{' '}
            {movie?.showTime || 'N/A'}
          </p>

          {/* Dates */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-1">DATES</h3>
            <p className="text-gray-400 text-sm mb-2">
              Selected Date: {new Date(selectedDate).toLocaleDateString()}
            </p>
            <div className="flex space-x-4">{generateDateButtons()}</div>
          </div>

          {/* Locations */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">LOCATIONS</h3>
            <div className="flex flex-wrap gap-4 font-bold">
              {availableLocations.map(loc => (
                <button
                  key={loc}
                  className={`hover:text-yellow-500 ${
                    selectedLocation === loc ? 'text-yellow-500 font-semibold' : 'text-white'
                  }`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Showtimes */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">SHOWTIMES</h3>
            {showtimes.length === 0 ? (
              <div className="bg-gray-900 text-gray-400 text-sm p-4 rounded-lg border border-gray-700">
                No showtimes available for{' '}
                <strong>
                  {new Date(selectedDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </strong>{' '}
                at <strong>{selectedLocation}</strong>.
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {showtimes.map((time, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                      selectedShowtime === time
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 hover:bg-yellow-500'
                    }`}
                    onClick={() => setSelectedShowtime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 p-4">
          <h3 className="text-xl font-bold mb-4">SELECT SEATS</h3>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-center mb-6 text-gray-400 border-b border-gray-600 pb-2">THE SCREEN</div>
            {renderSeats()}

            {/* Seat legend */}
            <div className="mt-6 text-sm text-white">
              <h4 className="mb-2 font-semibold">Legend:</h4>
              <div className="flex flex-wrap gap-4">
                <Legend color="bg-white" label="Available" />
                <Legend color="bg-yellow-500" label="Selected" />
                <Legend color="bg-gray-600" label="Booked" />
                <Legend color="bg-green-300" label="Companion" />
                <Legend color="border-2 border-blue-400" label="Wheelchair" />
                <Legend color="bg-gray-400" label="Disabled Seat" />
              </div>
            </div>

           
{/* Ticket Summary */}
<div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
  <h4 className="text-lg font-bold mb-2">Ticket Summary</h4>

  <p>Selected Seats: <strong>{selectedSeats.length}</strong></p>

  <p>Base Price: ₹{(selectedSeats.length * parseFloat(movie?.ticketPrice || 0)).toFixed(2)}</p>

  <p>Convenience Fee: ₹{(selectedSeats.length * 1.5).toFixed(2)}</p>

  <p>
    Tax (max ₹30): ₹{
      Math.min(
        30,
        ((selectedSeats.length * parseFloat(movie?.ticketPrice || 0)) + (selectedSeats.length * 1.5)) * 0.1
      ).toFixed(2)
    }
  </p>

  <hr className="my-2 border-gray-700" />

  <p className="font-bold text-lg">
    Total: ₹{calculateTotal()}
  </p>
</div>


              <button
                disabled={selectedSeats.length === 0 || !selectedShowtime}
                className={`mt-4 w-full py-2 rounded font-bold ${
                  selectedSeats.length === 0 || !selectedShowtime
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                }`}
                onClick={() => {
                  navigate('/checkout', {
                    state: {
                      movie,
                      date: selectedDate,
                      location: selectedLocation,
                      showtime: selectedShowtime,
                      seats: selectedSeats,
                      total: calculateTotal(),
                    },
                  });
                }}
              >
                Book Tickets
              </button>
            </div>
          </div>

          <div className="mt-4 text-right text-gray-400 text-sm">Theater 5</div>
        </div>
      </div>
    
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);

export default NowPlayingBookingPage;
