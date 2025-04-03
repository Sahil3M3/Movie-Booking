import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMovies from "../hooks/useMovies"; 
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import BookingForm from "../components/BookingForm";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movies = useMovies(); 
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    if (Object.keys(movies).length > 0) {
      let foundMovie = null;
      for (let category in movies) {
        foundMovie = movies[category]?.find((m) => m.id === id);
        if (foundMovie) break;
      }
      setMovie(foundMovie);
    }
  }, [movies, id]);

  useEffect(() => {
    if (id) {
      const showtimeRef = ref(database, "showtimes");
      onValue(showtimeRef, (snapshot) => {
        if (snapshot.exists()) {
          const allTimes = snapshot.val();
          const movieShowtimes = Object.values(allTimes).filter((st) => st.movieId === id);
          setShowtimes(movieShowtimes);
        } else {
          setShowtimes([]);
        }
      });
    }
  }, [id]);

  if (!movie) return <div className="text-center text-white mt-10 text-2xl">🎬 Loading Movie...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white ">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md">
        ⬅️ Back to Home
      </button>

      <div className="max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img src={movie.poster} alt={movie.name} className="w-full md:w-1/2 h-auto md:h-96 object-cover" />

        <div className="p-2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{movie.name}</h1>
          <p className="text-gray-300 text-lg">{movie.description}</p>
          <p className="text-gray-400 mt-2">🎬 Genre: {movie.genre}</p>
          <p className="text-gray-400">🎭 Language: {movie.language}</p>
          <p className="text-gray-400">🎬 Director: {movie.director}</p>
          <p className="text-gray-400">📅 Release Date: {movie.releaseDate}</p>
          <p className="text-yellow-400 text-lg mt-2">⭐ IMDB Rating: {movie.imdbRating}</p>

          {/* Showtimes */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-yellow-400">🎭 Available Showtimes:</h3>
            {showtimes.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {showtimes.map((time, index) => (
                  <span key={index} className="bg-gray-700 px-4 py-2 rounded-md">
                    {time.time} - {time.date}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No showtimes available</p>
            )}
          </div>

        {showtimes.length>0 &&  <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg">
            Book Tickets 🎟️
          </button>}

          {/* Booking Modal */}
          {isModalOpen && <BookingForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movie={movie} showtimes={showtimes} />}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
