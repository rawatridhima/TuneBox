import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import { authReducer } from "./Reducers/AuthReducer";
import storage from 'redux-persist/lib/storage'
import { SpotifyTokenReducer } from "./Reducers/SpotifyTokenReducer";

export default configureStore({
    reducer:persistReducer({
        key:'tuneBox',
        version:1,
        storage
    },combineReducers({
        auth:authReducer,
        spotifyToken:SpotifyTokenReducer
    }))
})