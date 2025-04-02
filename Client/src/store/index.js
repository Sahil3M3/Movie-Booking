import {configureStore} from "@reduxjs/toolkit"
import movieReducer from "./movie"

const store =configureStore({
   reducer:{
    movie:movieReducer
   }
})

export default store