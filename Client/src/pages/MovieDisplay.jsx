import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import useMovies from "../hooks/useMovies";

const MovieDisplay = () => {
  const movies = useMovies(); 

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
                    <img src={movie.poster} alt={movie.name} className="w-full h-60 object-cover rounded-md" />
                    <h3 className="text-lg font-semibold text-white mt-2">{movie.name}</h3>
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
