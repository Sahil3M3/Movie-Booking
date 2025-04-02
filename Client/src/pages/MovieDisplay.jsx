import React, { useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import HeroSlider from "../components/HeroSlider"; // Import the Hero Section slider
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { movieAction } from "../store/movie";

const MovieDisplay = () => {
  const movies=useSelector(state=>state.movie.movie);
  const dispatch=useDispatch();
  
  useEffect(() => {
    const moviesRef = ref(database, "movies");

    onValue(moviesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categorizedMovies = {};

        Object.keys(data).forEach((key) => {
          const movie = { id: key, ...data[key] };
          if (!categorizedMovies[movie.category]) {
            categorizedMovies[movie.category] = [];
          }
          categorizedMovies[movie.category].push(movie);
        });
          dispatch(movieAction.addMovies(categorizedMovies))
      }
    });
  }, []);

  return (
    <div className="container px-2 ">
      {movies["Hero Section"] && <HeroSlider movies={movies["Hero Section"]} />}

      {Object.entries(movies)
        .filter(([category]) => category !== "Hero Section")
        .map(([category, movieList]) => (
          <div key={category} className="mt-6">
            <h2 className="text-2xl font-bold text-black bg-purple-800 p-2 text-center underline mb-4">{category || "Movies"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movieList.map((movie) => (
                <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                  <Link to={`${movie.id}`} >
                  <img
                    src={movie.poster}
                    alt={movie.name}
                    className="w-full h-60 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-white mt-2">
                    {movie.name}
                  </h3>
                  <p className="text-gray-400">{movie.genre}</p>
                  <p className="text-yellow-400">⭐ {movie.imdbRating}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MovieDisplay;
