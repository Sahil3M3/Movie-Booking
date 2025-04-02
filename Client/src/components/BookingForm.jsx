import React, { useState } from "react";
import Modal from "react-modal";
import { database } from "../firebaseConfig";
import { ref, push } from "firebase/database";
import emailjs from "emailjs-com";

Modal.setAppElement("#root");

const BookingForm = ({ isOpen, onClose, movie, showtimes }) => {
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Booking Submission
  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedShowtime || !formData.name || !formData.email || !formData.phone) {
      alert("Please fill all fields.");
      return;
    }

    // Booking Data
    const bookingData = {
      movieId: movie.id,
      movieName: movie.name,
      showtime: selectedShowtime, // Now a string like "2025-04-01 6:00 PM"
      ...formData,
    };
    

    // ✅ Save Booking to Firebase
    push(ref(database, "bookings"), bookingData);

    // ✅ Send Email Confirmation
    
    emailjs.send(
      
      import.meta.env.VITE_EMAILJS_SERVICE,
      import.meta.env.VITE_EMAILJS_TEMPLATE,
      {
        user_name: formData.name,
        user_email: formData.email,
        movie_name: movie.name,
        showtime: selectedShowtime,
      },
      import.meta.env.VITE_EMAILJS_PUBLICKEY
    );

    alert("Booking Confirmed! 🎟️ Confirmation email sent.");
    onClose(); // Close Modal
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl text-yellow-400 font-bold mb-4">🎟️ Book Tickets</h2>

      <form onSubmit={handleBooking} className="flex flex-col space-y-4">
        {/* Movie Name (Read-Only) */}
        <input type="text" value={movie.name} className="p-2 bg-gray-700 text-white rounded-md" readOnly />

        {/* Select Showtime */}
        <select
  className="p-2 bg-gray-700 text-white rounded-md"
  onChange={(e) => setSelectedShowtime(e.target.value)}
  required
>
  <option value="">🕒 Select Showtime</option>
  {showtimes.map((time, index) => (
    <option key={index} value={`${time.date} ${time.time}`}>
      {time.time} - {time.date}
    </option>
  ))}
</select>


        {/* Name Input */}
        <input type="text" name="name" placeholder="Your Name" className="p-2 bg-gray-700 text-white rounded-md" onChange={handleChange} required />

        {/* Email Input */}
        <input type="email" name="email" placeholder="Your Email" className="p-2 bg-gray-700 text-white rounded-md" onChange={handleChange} required />

        {/* Phone Input */}
        <input type="tel" name="phone" placeholder="Your Phone Number" className="p-2 bg-gray-700 text-white rounded-md" onChange={handleChange} required />

        {/* Submit Button */}
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg transition">
          Confirm Booking ✅
        </button>
      </form>

      {/* Close Modal */}
      <button onClick={onClose} className="mt-4 text-red-400">❌ Cancel</button>
    </Modal>
  );
};

export default BookingForm;
