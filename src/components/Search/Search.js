import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../Helper/Loader/Loader";
import "./Search.css";
import Player from "../../Player/Player"
import Landing from "../Landing/Landing";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const Search = ({ data ,setSearch,refresh,handleChange}) => {
  //   states
  const [loader, setLoader] = useState(false);
  const token = useSelector((x) => x.spotifyToken);
  const [requiredData, setRequiredData] = useState("");
  const [comp,setComp]=useState(0);
  const [track,setTrack]=useState();
  const [album,setAlbum]=useState();

  // methods
  const getTracks = async () => {
    setLoader(true);
    axios
      .get(
        `https://api.spotify.com/v1/search?q=${data}&type=album,track&limit=10`,
        {
          headers: {
            Authorization: "Bearer " + token.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        setRequiredData(res.data);
        console.log(res.data);
    
        setSearch("")
      })
      .catch(function (res) {
        if (res instanceof Error) {
          console.log(res.message);
        } else {
          console.log(res.data);
        }
      });
    setLoader(false);
  };

 const viewArray=[
  {component:<Player data={album} isAlbum={true} isTrack={false}/>},
  {component: <Player detail={track} isTrack={true} isAlbum={false}/>},
  {component:<Landing />},
 
 ]

  //   rendering
  useEffect(() => {
    getTracks();
  }, [refresh]);

  return (
    <>
{
  comp>0 && comp!=3 ? (
    <div className="show">
          <div className="top">
            <FaRegArrowAltCircleLeft
              className="icon"
              onClick={() => setComp(3)}
            />
          </div>
          {viewArray.map((nav, idx) => {
            if (idx + 1 === comp) return nav.component;
          })}
        </div>
  ):comp==3?(viewArray[2].component):(
    <div className="body">
      {requiredData && comp==0 ? (
        <div className="screen">
          <div className="search-top">
            <RxCross2 className="icon" onClick={handleChange} />
          </div>
          <div className="search-bottom">
            {requiredData?.albums.items.length > 0
              ? requiredData.albums.items.map((a, b) => (
                  <div className="content" key={b} onClick={()=>{
                    setAlbum(a)
                    setComp(1)
                  }}>
                    <div className="same">
                      <img src={a.images[2].url} alt="" />
                      <div className="names">
                        <h4>{a.name}</h4>
                        <h5>{a.artists[0].name}</h5>
                      </div>
                    </div>
                    <h5>{`Type:${a.type}`}</h5>
                  </div>
                ))
              : null}
            {requiredData?.tracks.items.length > 0
              ? requiredData.tracks.items.map((x, y) => (
                  <div className="content" key={y} onClick={()=>{
                    setTrack(x)
                    setComp(2)
                  }}>
                    <div className="same">
                      <img src={x.album.images[2].url} alt="" />
                      <div className="names">
                        <h4>{x.name}</h4>
                        <h5>{x.artists[0].name}</h5>
                      </div>
                    </div>

                    <h5>{`Type:${x.type}`}</h5>
                  </div>
                ))
              : null}
          </div>
        </div>
      ) : (
        <Loader size={50} fullHeight={true} fullWidth={true} />
      )}

    </div>
  )
}
    </>
  
  );
};

export default Search;
