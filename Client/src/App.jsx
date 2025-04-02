import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import MovieDisplay from "./pages/MovieDisplay"
import MovieDetail from "./pages/MovieDetail"


function App() {

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Layout/>}>
      <Route index element={<MovieDisplay/>} />
    <Route path=":id" element={<MovieDetail/>} />      
      
    </Route>
   </Routes>
   
   </BrowserRouter>
  )
}

export default App
