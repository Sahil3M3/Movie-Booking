import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMovie, fetchCategories } from "../store/movie";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const uploadToSupabase = async (file, folder = "posters") => {
  if (!file) return null;

  const filePath = `${folder}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("movie-booking")
    .upload(filePath, file, { contentType: file.type });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: publicURL } = supabase.storage.from("movie-booking").getPublicUrl(filePath);
  return publicURL.publicUrl;
};

const AddMovie = () => {
  const { categories, loading } = useSelector((state) => state.movie);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState({
    name: "",
    description: "",
    director: "",
    genre: "",
    releaseDate: "",
    language: "",
    imdbRating: "",
    category: "",
    poster: null,
    heroImage: null,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
    if (categories.length === 0) dispatch(fetchCategories());
  }, [user, authLoading, categories.length, dispatch, navigate]);

  const handleChange = (e) => {
    setMovieDetails({ ...movieDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMovieDetails({ ...movieDetails, [e.target.name]: e.target.files[0] });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    try {
      const posterUrl = await uploadToSupabase(movieDetails.poster, "posters");
      let heroImageUrl = null;
      if (movieDetails.category === "Hero Section") {
        heroImageUrl = await uploadToSupabase(movieDetails.heroImage, "hero-images");
      }

      dispatch(addMovie({
        ...movieDetails,
        poster: posterUrl,
        heroImage: heroImageUrl,
      }));

      alert("Movie Added");

      setMovieDetails({
        name: "",
        description: "",
        director: "",
        genre: "",
        releaseDate: "",
        language: "",
        imdbRating: "",
        category: "",
        poster: null,
        heroImage: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add movie. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Add Movie</h2>

        <form onSubmit={handleAddMovie} className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" value={movieDetails.name} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Director */}
          <div className="flex flex-col">
            <label htmlFor="director" className="text-sm font-medium mb-1">Director</label>
            <input type="text" name="director" value={movieDetails.director} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Genre */}
          <div className="flex flex-col">
            <label htmlFor="genre" className="text-sm font-medium mb-1">Genre</label>
            <input type="text" name="genre" value={movieDetails.genre} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Release Date */}
          <div className="flex flex-col">
            <label htmlFor="releaseDate" className="text-sm font-medium mb-1">Release Date</label>
            <input type="date" name="releaseDate" value={movieDetails.releaseDate} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Language */}
          <div className="flex flex-col">
            <label htmlFor="language" className="text-sm font-medium mb-1">Language</label>
            <input type="text" name="language" value={movieDetails.language} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* IMDB Rating */}
          <div className="flex flex-col">
            <label htmlFor="imdbRating" className="text-sm font-medium mb-1">IMDB Rating</label>
            <input type="text" name="imdbRating" value={movieDetails.imdbRating} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Description (full width) */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={movieDetails.description} onChange={handleChange} rows={3} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium mb-1">Category</label>
            <select name="category" value={movieDetails.category} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <option key={index} value={category.category}>{category.category}</option>
                ))
              ) : (
                <option value="">No categories found</option>
              )}
            </select>
          </div>

          {/* Movie Poster */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Movie Poster</label>
            <input 
              type="file" 
              name="poster" 
              onChange={handleFileChange} 
              className="text-white p-1 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-600 file:text-white" 
              required 
            />
          </div>

          {/* Hero Image (conditional) */}
          {movieDetails.category === "Hero Section" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Hero Section Image</label>
              <input 
                type="file" 
                name="heroImage" 
                onChange={handleFileChange} 
                className="text-white p-1 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-600 file:text-white" 
                required 
              />
            </div>
          )}

          {/* Submit Button (full width on all screens) */}
          <button
            type="submit"
            className={`w-full sm:col-span-2 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 rounded-md transition-all duration-300`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
