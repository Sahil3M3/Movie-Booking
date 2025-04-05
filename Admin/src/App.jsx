import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import AddCategory from "./pages/AddCategory"
import AddMovie from "./pages/AddMovie"
import ShowtimeManagement from "./pages/ShowtimeManagement"
import BookedMovies from "./pages/BookedMovies"
import { useDispatch } from "react-redux"
import { listenForAuthChanges } from "./store/auth"
import { useEffect } from "react"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    listenForAuthChanges(dispatch);
  }, [dispatch]);

  return (
   <BrowserRouter>
     <Routes>
      <Route path="/" >
        <Route index element={<Login/>} />  
      </Route>
      <Route path="/admin" element={<Layout/>}>
         <Route index element={<AddCategory/>} /> 
         <Route path="add-movie" element={<AddMovie />} />
           <Route path="showtime-management" element={<ShowtimeManagement />} />
         <Route path="booked-movies" element={<BookedMovies />} />
      </Route> 
     </Routes>
   </BrowserRouter>
  )
}

export default App
