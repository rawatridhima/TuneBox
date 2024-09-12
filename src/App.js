import React, { useEffect, useState } from "react";
import Hero from "./components/Hero/Hero";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Reducers/AuthReducer";
import Dashboard from "./components/Dashboard/Dashboard";
import { resetToken, setToken } from "./Reducers/SpotifyTokenReducer";

const App = () => {
  // states
  const auth = useSelector((x) => x.auth);
  const spotifyToken = useSelector((x) => x.spotifyToken);
  const dispatch = useDispatch();
  const location = useLocation();
  const [hasTriggered,setHasTriggred]=useState(false);

  // methods
  const handleToken = () => {
    const scopes = ["user-library-read", "playlist-read-private"];
    window.location.href = `${process.env.REACT_APP_AUTH_BASEURL}client_id=${
      process.env.REACT_APP_CLIENT_ID
    }&redirect_uri=${process.env.REACT_APP_REDIRECT_URIS}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;
  };
  const checkTime=()=>{
const currTime=(new Date(Date.now())).getTime();
if(spotifyToken.expires < currTime && !hasTriggered){
setHasTriggred(true);
}
  }

  // rendering

  useEffect(() => {
    const currDate = new Date(Date.now());
    if (!auth.isRemember && currDate.getTime() >= auth.remember_token)
      dispatch(logout());
  }, []);
  useEffect(() => {
    if (location.hash) {
      const token = location.hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      dispatch(setToken(token))
      window.location.hash=""
    }
    else{
      if(spotifyToken.token){
        const currTime=new Date(Date.now())
        if(spotifyToken.expires < currTime.getTime()){
          dispatch(resetToken())
          handleToken()
        }
      }
      else{
        handleToken()
      }
    }
console.log(spotifyToken)
  }, [hasTriggered]);

  useEffect(()=>{
const timeInterval=setInterval(checkTime,1000)
return ()=>clearInterval(timeInterval)
  },[])

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
