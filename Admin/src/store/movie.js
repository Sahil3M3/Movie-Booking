import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "../firebaseConfig";
import { ref, push, set, onValue } from "firebase/database";


// ✅ Async Thunk for Fetching Categories
export const fetchCategories = createAsyncThunk(
  "movie/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return new Promise((resolve, reject) => {
        const categoryRef = ref(database, "categories");
        onValue(categoryRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const categoryList = Object.values(data);
            resolve(categoryList);
          } else {
            resolve([]); // Return an empty array if no categories exist
          }
        });
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// ✅ Async Thunk for Adding a New Category
export const addCategory = createAsyncThunk(
  "movie/addCategory",
  async (category, { rejectWithValue }) => {
    try {
      const categoryRef = ref(database, "categories");
      const newCategoryRef = push(categoryRef);
      await set(newCategoryRef, { category });
      return category; // Return the added category
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// ✅ Async Thunk for Fetching Movies
export const fetchMovies = createAsyncThunk(
  "movie/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      return new Promise((resolve, reject) => {
        const movieRef = ref(database, "movies");
        onValue(movieRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const movieList = Object.entries(data).map(([id, movie]) => ({ id, ...movie }));
            resolve(movieList);
          } else {
            resolve([]); // Return empty array if no movies exist
          }
        });
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// ✅ Async Thunk for Adding a New Movie
export const addMovie = createAsyncThunk(
  "movie/addMovie",
  async (movie, { rejectWithValue }) => {
    try {
      const movieRef = ref(database, "movies");
      const newMovieRef = push(movieRef);
      await set(newMovieRef, movie);
      return { id: newMovieRef.key, ...movie }; // Return the newly added movie with an ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const movieSlice = createSlice({
  name: "movie",
  initialState: {
    categories: [], // Stores fetched categories
    movies: [], // Stores fetched movies
    showtimes: [], // Stores showtimes (optional)
    loading: false, // Loading state for async operations
    error: null, // Error messages if any
  },
  reducers: {}, // No synchronous reducers needed
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push({ category: action.payload });
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Movie
      .addCase(addMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload);
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;
