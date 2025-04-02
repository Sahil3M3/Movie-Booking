import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {movieAction} from "../store/movie"
import BookingForm from "../components/BookingForm"

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const movies = useSelector((state) => state.movie?.movie || {});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let foundMovie = null;

    if (movies.length>0 && Object.keys(movies).length > 0) {
      // ✅ Check if movies exist in Redux Store
      console.log(movies);
      
      for (let cat in movies) {
      
        foundMovie = movies[cat]?.find((m) => m.id === id);
        if (foundMovie) break;
      }
      setMovie(foundMovie);
    }

    // ✅ If movie is NOT found in Redux, fetch from Firebase
    if (!foundMovie) {
      const movieRef = ref(database, "movies");
      const categorizedMovies = {};

      onValue(movieRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          Object.keys(data).forEach((key) => {
            const movie1 = { id: key, ...data[key] };
            if (!categorizedMovies[movie1.category]) {
              categorizedMovies[movie1.category] = [];
            }
            categorizedMovies[movie1.category].push(movie1);
          });

          let movieList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          let fetchedMovie = movieList.find((m) => m.id === id);
          if (fetchedMovie) {
            setMovie(fetchedMovie);
          }
          
          // ✅ Store all movies in Redux for future use
          
          dispatch(movieAction.addMovies(categorizedMovies));
        }
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    // ✅ Fetch showtimes from Firebase
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md"
      >
        ⬅️ Back to Home
      </button>

      <div className="max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img src={movie.poster} alt={movie.name} className="w-full md:w-1/2 h-auto md:h-96 object-cover" />

        <div className="p-6 flex flex-col justify-center">
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

          <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg">
            Book Tickets 🎟️
          </button>

          {/* Booking Modal */}
          {isModalOpen && <BookingForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movie={movie} showtimes={showtimes} />
        }
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
