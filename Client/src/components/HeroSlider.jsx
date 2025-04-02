import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlider = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const moviesRef = ref(database, "movies");

    onValue(moviesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const heroList = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((movie) => movie.category === "Hero Section");

        setHeroMovies(heroList);
      } else {
        setHeroMovies([]);
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroMovies.length);
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {heroMovies.length === 0 ? (
        <p className="text-white text-center">No Hero Section Movies</p>
      ) : (
        <AnimatePresence>
          <motion.div
            key={heroMovies[index]?.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <img
              src={heroMovies[index]?.poster || "placeholder.jpg"}
              alt={heroMovies[index]?.name}
              className="w-2/3 h-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
              <h2 className="text-4xl font-bold">{heroMovies[index]?.name}</h2>
              <p className="text-lg mt-2">{heroMovies[index]?.description}</p>
              <p className="text-yellow-400 mt-2">
                ⭐ {heroMovies[index]?.imdbRating}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default HeroSlider;
