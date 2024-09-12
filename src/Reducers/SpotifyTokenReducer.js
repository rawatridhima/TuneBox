import { createSlice } from "@reduxjs/toolkit";

const SpotifyToken = createSlice({
  name: "SpotifyToken",
  initialState: {
    token: null,
    expires: null,
  },
  reducers: {
    setToken: (state, action) => {
      const currTime = new Date(Date.now());
      state.token = action.payload;
      state.expires = (new Date(currTime.getTime() + 60*60 * 1000)).getTime();
    },
    resetToken: (state) => {
      state.token = null;
      state.expires = null;
    },
  },
});
export const {setToken,resetToken} = SpotifyToken.actions;
export const SpotifyTokenReducer = SpotifyToken.reducer;
