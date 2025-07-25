import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from "react-qr-code";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const CheckoutPage = () => {
  const { state } = useLocation();
  const ticketRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const posterUrl = `http://localhost:5000/uploads/${state.movie.poster}`;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !posterLoaded) {
      alert("Please wait for the movie poster to load before downloading.");
      return;
    }

    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('movie-ticket.pdf');
  };
const handleSendEmail = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/email/send-email', {
      to: 'test@example.com', // ✅ Replace with actual dynamic email like user.email
      subject: '🎟️ Your Movie Ticket',
      html: '<h1>Your ticket is confirmed!</h1><p>Enjoy your movie 🎬</p>',
    });

    console.log('✅ Email sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};


return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">Checkout</h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Ticket Preview */}
        <div ref={ticketRef} className="bg-gray-900 p-6 rounded-lg shadow-lg relative">
          {state?.movie?.poster ? (
            <img
              src={posterUrl}
              alt="Poster"
              onLoad={() => setPosterLoaded(true)}
              className="w-full h-64 object-cover rounded mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-400">
              Loading poster...
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2">{state.movie.movieTitle}</h2>
          <p>{state.date} @ {state.showtime}</p>
          <p>{state.location}</p>
          <p>Seats: {state.seats.join(', ')}</p>
          <p className="mt-2 text-lg font-bold">Total: ₹{state.total}</p>
          <div className="mt-4">
            <QRCode value={JSON.stringify(state)} size={100} fgColor="#000" bgColor="#fff" />
          </div>
        </div>

        {/* Payment and Actions */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Payment Method</h3>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`px-4 py-2 rounded ${paymentMethod === 'card' ? 'bg-yellow-500 text-black' : 'bg-gray-600'}`}
            >
              Card
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`px-4 py-2 rounded ${paymentMethod === 'upi' ? 'bg-yellow-500 text-black' : 'bg-gray-600'}`}
            >
              UPI
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div className="space-y-4">
              <input type="text" placeholder="Card Number" className="w-full p-2 rounded bg-gray-700" />
              <input type="text" placeholder="Expiry" className="w-full p-2 rounded bg-gray-700" />
              <input type="text" placeholder="CVV" className="w-full p-2 rounded bg-gray-700" />
            </div>
          ) : (
            <div>
              <input type="text" placeholder="UPI ID" className="w-full p-2 rounded bg-gray-700 mb-4" />
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Email Ticket</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 mb-2"
            />
            <button
              onClick={handleSendEmail}
              className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
            >
              Send to Email
            </button>
            {emailSent && <p className="text-green-400 mt-2">Email sent successfully!</p>}
          </div>

          <button
            onClick={handleDownloadPDF}
            className="mt-6 w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
          >
            Download PDF Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;