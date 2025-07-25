import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, movie, showtime } = location.state || {}; // Get passed data

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  if (!selectedSeats || !movie || !showtime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold">No booking details found. Redirecting...</h2>
      </div>
    );
  }

  const ticketPrice = 10; // Price per seat
  const totalAmount = selectedSeats.length * ticketPrice;

  const handlePayment = () => {
    alert(`Payment successful! Booking confirmed for ${selectedSeats.length} seat(s).`);
    navigate("/"); // Redirect to Dashboard or another page
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-yellow-500">Checkout</h1>

      {/* Movie & Booking Details */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold">{movie.title}</h2>
        <p className="text-gray-400">Showtime: {showtime}</p>
        <p className="text-gray-400">Seats: {selectedSeats.join(", ")}</p>
        <p className="text-yellow-400 font-bold">Total: ${totalAmount}</p>
      </div>

      {/* Payment Options */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl mb-2">Select Payment Method</h3>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>UPI</option>
          <option>PayPal</option>
        </select>
      </div>

      {/* Pay Now Button */}
      <button
        className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-yellow-600 w-full"
        onClick={handlePayment}
      >
        Pay Now
      </button>

      {/* Back to Booking */}
      <button
        className="mt-4 px-4 py-2 bg-gray-700 rounded w-full"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default Checkout;
