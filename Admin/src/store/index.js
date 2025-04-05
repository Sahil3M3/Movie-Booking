import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../store/movie"
import authReducer from "./auth"

const store=configureStore({
    reducer:{
        movie:movieReducer,
        auth:authReducer
    }
})
export default store;