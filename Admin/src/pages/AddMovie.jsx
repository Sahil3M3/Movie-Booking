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
    <div className="min-h-screen bg-black p-4 flex justify-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-lg p-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Movie</h2>

        <form onSubmit={handleAddMovie} className="space-y-4">
          {[
            { name: "name", label: "Name" },
            { name: "director", label: "Director" },
            { name: "genre", label: "Genre" },
            { name: "releaseDate", label: "Release Date", type: "date" },
            { name: "language", label: "Language" },
            { name: "imdbRating", label: "IMDB Rating" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label htmlFor={field.name} className="text-sm mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={movieDetails[field.name]}
                onChange={handleChange}
                className="p-2 border border-gray-600 bg-gray-700 rounded-md w-full"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={movieDetails.description}
              onChange={handleChange}
              rows={3}
              className="p-2 border border-gray-600 bg-gray-700 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm mb-1">Category</label>
            <select
              name="category"
              value={movieDetails.category}
              onChange={handleChange}
              className="p-2 border border-gray-600 bg-gray-700 rounded-md"
            >
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <option key={i} value={cat.category}>{cat.category}</option>
                ))
              ) : (
                <option value="">No categories found</option>
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Movie Poster</label>
            <input
              type="file"
              name="poster"
              onChange={handleFileChange}
              className="file:bg-blue-600 file:text-white file:px-3 file:py-1 file:border-0 file:rounded"
              required
            />
          </div>

          {movieDetails.category === "Hero Section" && (
            <div className="flex flex-col">
              <label className="text-sm mb-1">Hero Image</label>
              <input
                type="file"
                name="heroImage"
                onChange={handleFileChange}
                className="file:bg-blue-600 file:text-white file:px-3 file:py-1 file:border-0 file:rounded"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 rounded-md`}
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
