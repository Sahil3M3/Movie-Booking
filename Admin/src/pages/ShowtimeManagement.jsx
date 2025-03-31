import { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, push, set, onValue } from "firebase/database";

const ShowtimeManagement = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const movieRef = ref(database, "movies");
    onValue(movieRef, (snapshot) => {
      if (snapshot.exists()) {
        const moviesData = snapshot.val();
        const movieList = Object.keys(moviesData).map((key) => ({
          id: key,
          ...moviesData[key],
        }));
        setMovies(movieList);
      }
    });

    const showtimeRef = ref(database, "showtimes");
    onValue(showtimeRef, (snapshot) => {
      if (snapshot.exists()) {
        const showtimeData = snapshot.val();
        const showtimeList = Object.keys(showtimeData).map((key) => ({
          id: key,
          ...showtimeData[key],
        }));
        setShowtimes(showtimeList);
      }
    });
  }, []);

  const handleChange = (e) => {
    setNewShowtime({ ...newShowtime, [e.target.name]: e.target.value });
  };

  
  const handleAddShowtime = async (e) => {
    e.preventDefault();

    if (!newShowtime.movieId || !newShowtime.date || !newShowtime.time ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const showtimeRef = ref(database, "showtimes");
      const newShowtimeRef = push(showtimeRef);
      await set(newShowtimeRef, newShowtime);
      console.log("Showtime Added");

      setNewShowtime({
        movieId: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error("Error adding showtime:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Manage Showtimes</h2>

      <form onSubmit={handleAddShowtime} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Select Movie</label>
          <select name="movieId" value={newShowtime.movieId} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md">
            <option value="">Select a Movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Show Date</label>
          <input type="date" name="date" value={newShowtime.date} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Show Time</label>
          <input type="time" name="time" value={newShowtime.time} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <button type="submit" className="col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-300">
          Add Showtime
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-2">Showtime List</h3>
      <div className="bg-gray-700 p-4 rounded-lg">
        {showtimes.length > 0 ? (
          showtimes.map((showtime) => (
            <div key={showtime.id} className="border-b border-gray-600 py-2">
              <p>
                <strong>Movie:</strong> {movies.find((m) => m.id === showtime.movieId)?.name || "Unknown"}
              </p>
              <p>
                <strong>Date:</strong> {showtime.date}
              </p>
              <p>
                <strong>Time:</strong> {showtime.time}
              </p>
              <p>
                <strong>Screen:</strong> {showtime.screen}
              </p>
            </div>
          ))
        ) : (
          <p>No showtimes available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowtimeManagement;
