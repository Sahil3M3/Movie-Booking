import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import AddCategory from "./pages/AddCategory"
import AddMovie from "./pages/AddMovie"

function App() {

  return (
   <BrowserRouter>
     <Routes>
      <Route path="/" >
        <Route index element={<Login/>} />  
      </Route>
      <Route path="/admin" element={<Layout/>}>
         <Route path="add-category" element={<AddCategory/>} /> 
         <Route path="add-movie" element={<AddMovie />} />
          {/* <Route path="showtime-management" element={<ShowtimeManagement />} />
          <Route path="booked-movies" element={<BookedMovies />} /> */}
      </Route> 
     </Routes>
   </BrowserRouter>
  )
}

export default App
