import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

const BookedMovies = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const bookingRef = ref(database, "bookings");

    onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allBookings = Object.values(data);
        setBookings(allBookings);
      } else {
        setBookings([]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">🎟️ Booked Movies</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md p-4 border border-yellow-500 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-bold text-yellow-300 mb-2">{booking.movieName}</h2>
              <p><span className="font-semibold text-gray-300">Name:</span> {booking.name}</p>
              <p className="nowrap"><span className="font-semibold text-gray-300">Email:</span> {booking.email}</p>
              <p><span className="font-semibold text-gray-300">Date:</span> {booking.showtime.split(" ")[0]}</p>
              <p><span className="font-semibold text-gray-300">Time:</span> {booking.showtime.split(" ")[1]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedMovies;
