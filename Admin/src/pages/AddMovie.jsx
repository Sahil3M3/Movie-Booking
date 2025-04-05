import { database } from "../firebaseConfig";
import { ref, push, set, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { addMovie, fetchCategories } from "../store/movie";
import { useNavigate } from "react-router-dom";

const uploadToSupabase = async (file, folder = "posters") => {
  if (!file) return null;

  const filePath = `${folder}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("movie-booking") // Your bucket name
    .upload(filePath, file, { contentType: file.type });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  // Get the public URL correctly
  const { data: publicURL } = supabase.storage.from("movie-booking").getPublicUrl(filePath);
  return publicURL.publicUrl; // Return the correct URL
};

const AddMovie = () => {
  const { categories, loading } = useSelector((state) => state.movie);
  const {user,loading:load}=useSelector(state=>state.auth);
  const navigate=useNavigate();

  const dispatch=useDispatch();
           
  useEffect(()=>{
            
    if( !load && !user)
      navigate("/")
   },
  [user,loading,navigate])
  

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
          if(categories.length==0)
            dispatch(fetchCategories())

  }, []);

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
  
    dispatch(addMovie(
      {
           ...movieDetails,
            category: movieDetails.category,
            poster: posterUrl,
            heroImage: heroImageUrl,
      }
    ))
  
      alert("Movie Added");
      setMovieDetails({
        name: "",
        description: "",
        director: "",
        genre: "",
        releaseDate: "",
        language: "",
        imdbRating: "",
        poster: null,
        heroImage: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add movie. Please try again.");
    } 
  };
  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Movie</h2>
      <form onSubmit={handleAddMovie} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input type="text" name="name" value={movieDetails.name} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="director">Director</label>
          <input type="text" name="director" value={movieDetails.director} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="genre">Genre</label>
          <input type="text" name="genre" value={movieDetails.genre} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="releaseDate">Release Date</label>
          <input type="date" name="releaseDate" value={movieDetails.releaseDate} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="language">Language</label>
          <input type="text" name="language" value={movieDetails.language} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="imdbRating">IMDB Rating</label>
          <input type="text" name="imdbRating" value={movieDetails.imdbRating} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea name="description" value={movieDetails.description} onChange={handleChange} className="p-2 border border-gray-600 bg-gray-700 rounded-md" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" htmlFor="category">Category</label>
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

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Movie Poster</label>
          <input type="file" name="poster" onChange={handleFileChange} className="text-white p-1" required />
        </div>

        {movieDetails.category === "Hero Section" && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Hero Section Image</label>
            <input type="file" name="heroImage" onChange={handleFileChange} className="text-white p-1" required />
          </div>
        )}

<button 
  type="submit" 
  className={`col-span-2 w-full ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 rounded-md transition-all duration-300`} 
  disabled={loading} // Disable button when loading
>
  {loading ? "Adding..." : "Add Movie"}
</button>
      </form>
    </div>
  );
};

export default AddMovie;

