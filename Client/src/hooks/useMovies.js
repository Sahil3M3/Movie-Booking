import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { movieAction } from "../store/movie";

const useMovies = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.movie);

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

        dispatch(movieAction.addMovies(categorizedMovies));
      }
    });
  }, [dispatch]);

  return movies;
};

export default useMovies;
