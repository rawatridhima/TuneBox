import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useSelector } from "react-redux";
import axios from "axios";
import "../Albums/Albums.css";
import Loader from "../../Helper/Loader/Loader";
import AllTracks from "./AllTracks";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { convertNum } from "../../Helper/Helper";
import DetailedAlbum from "../Albums/DetailedAlbum";
import Player from "../../Player/Player";
import AllAlbums from "../Albums/AllAlbums";

const Landing = () => {
  // states
  const [loader, setLoader] = useState(false);
  const token = useSelector((x) => x.spotifyToken);
  const [comp, setComp] = useState(0);
  const [detail, setDetail] = useState();
  const [detailTrack, setDetailTrack] = useState();
  const [track, setTrack] = useState();
  const [data, setData] = useState();
  const [isTrack, setIsTrack] = useState(false);
  const [isAlbum, setIsAlbum] = useState(false);

  const viewArray = [
    {
      component: <AllTracks data={track} />,
    },
    {
      component: <AllAlbums data={data} />,
    },
    {
      component: (
        <Player detail={detailTrack} isAlbum={isAlbum} isTrack={isTrack} />
      ),
    },
    {
      component: <DetailedAlbum detail={detail} />,
    },
  ];

  // methods
  const getTracks = async () => {
    setLoader(true);
    axios
      .get(
        "https://api.spotify.com/v1/recommendations?limit=100&offset=2market=ES&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical,country&seed_tracks=0c6xIDDpzE81m2q797ordA",
        {
          headers: {
            Authorization: "Bearer " + token.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        console.log(res.data);
        setTrack(res.data.tracks);
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
  const getAlbumnsData = async () => {
    setLoader(true);
    axios
      .get("https://api.spotify.com/v1/browse/new-releases?limit=50&offset=0", {
        headers: {
          Authorization: "Bearer " + token.token,
          "Content-Type": "application/json",
        },
      })
      .then(function (res) {
        setData(res.data.albums.items);
        console.log(res.data);
        setLoader(false);
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

  // rendering
  useEffect(() => {
    getTracks();
    getAlbumnsData();
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      {comp != 0 ? (
        <div className="show">
          <div className="top">
            <FaRegArrowAltCircleLeft
              className="icon"
              onClick={() => setComp(0)}
            />
          </div>
          {viewArray.map((nav, idx) => {
            if (idx + 1 === comp) return nav.component;
          })}
        </div>
      ) : (
        <div className="body">
          {track || data ? null : (
            <Loader size={50} fullHeight={true} fullWidth={true} />
          )}
          <div className="second">
            <h4>Trending</h4>
            <div className="container">
              {track
                ? track.slice(20, 35).map((a, b) => (
                    <div
                      className="contain"
                      key={b}
                      onClick={() => {
                        setDetailTrack(a);
                        setIsTrack(true);
                        setComp(3);
                      }}
                    >
                      <h1>{convertNum(b + 1)}</h1>
                      <img src={a.album.images[0].url} />
                      <div className="names">
                        <h5 className="name">{a.name}</h5>
                        <h5 className="artist">{a.artists[0].name} </h5>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="first">
            <div className="upper">
              <h4>Tracks</h4>
              <h5 onClick={() => setComp(1)}>View More</h5>
            </div>
            <div className="outer">
              {track
                ? track.slice(0, 10).map((x, i) => (
                    <div
                      className="block"
                      key={i}
                      onClick={() => {
                        setDetailTrack(x);
                        setIsTrack(true);
                        setComp(3);
                      }}
                    >
                      <img src={x.album.images[0].url} />
                      <h5 className="name">{x.name}</h5>
                      <h5 className="artist">{x.artists[0].name} </h5>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="first">
            <div className="upper">
              <h4> Albums</h4>
              <h5 onClick={() => setComp(2)}>View More</h5>
            </div>
            <div className="outer">
              {data
                ? data.slice(0, 10).map((x, i) => (
                    <div
                      className="block"
                      key={i}
                      onClick={() => {
                        setDetail(x);
                        setIsAlbum(true);
                        setComp(4);
                      }}
                    >
                      <img src={x.images[0].url} alt="" />
                      <h5 className="name">{x.name}</h5>
                      <h5 className="artist">{x.artists[0].name} </h5>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Landing;
