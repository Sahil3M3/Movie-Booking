import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const listenForAuthChanges = (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    dispatch(setUser(user ? { email: user.email, uid: user.uid } : null));
  });
};
export const logoutUser = () => async (dispatch) => {
  await signOut(auth);
  dispatch(logout());
};