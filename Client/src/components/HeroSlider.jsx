import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSlider = ({ movies = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return <p className="text-white text-center">No Hero Section Movies</p>;
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden flex justify-center items-center bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <Link to={`/${movies[index]?.id}`} className="relative w-full h-full flex justify-center items-center">
            <img
              src={movies[index]?.poster || "placeholder.jpg"}
              alt={movies[index]?.name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
              <h2 className="text-4xl font-bold">{movies[index]?.name}</h2>
              <p className="text-lg mt-2 max-w-lg">{movies[index]?.description}</p>
              <p className="text-yellow-400 mt-2">⭐ {movies[index]?.imdbRating}</p>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSlider;
