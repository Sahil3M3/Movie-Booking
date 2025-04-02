import { createSlice } from "@reduxjs/toolkit";

const movieSlice=createSlice({
    name:"movie",
    initialState:{
        movie:[],
    },
    reducers:{
        addMovies(state,action){
            state.movie=action.payload;
        }
    }
})
export const movieAction= movieSlice.actions;

export default movieSlice.reducer