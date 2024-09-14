import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Albums.css";
import Loader from "../../Helper/Loader/Loader";
import { convertNum } from "../../Helper/Helper";
import AllAlbums from "./AllAlbums";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import DetailedAlbum from "./DetailedAlbum";

const Albums = () => {
  // states
  const token = useSelector((x) => x.spotifyToken);
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [comp, setComp] = useState(0);
  const [detail, setDetail] = useState();

  const viewArray = [
    {
      component: <AllAlbums data={data} />,
    },
    {
      component: <DetailedAlbum detail={detail} />,
    },
  ];

  // methods
  const getAlbumnsData = async () => {
    setLoader(true);
    console.log(token.token);
    axios
      .get("https://api.spotify.com/v1/browse/new-releases?limit=50&offset=0", {
        headers: {
          Authorization: "Bearer " + token.token,
          "Content-Type": "application/json",
        },
      })
      .then(function (res) {
        setData(res.data.albums.items);
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
    getAlbumnsData();
  }, []);
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
          {data ? null : (
            <Loader size={50} fullHeight={true} fullWidth={true} />
          )}
          <div className="first">
            <div className="upper">
              <h4>Featured Albums</h4>
              <h5 onClick={() => setComp(1)}>View More</h5>
            </div>
            <div className="outer">
              {data
                ? data.slice(0, 10).map((x, i) => (
                    <div
                      className="block"
                      key={i}
                      onClick={() => {
                        setDetail(x);
                        setComp(2);
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
          <div className="first">
            <div className="upper">
              <h4>Trending Albums</h4>
              <h5 onClick={() => setComp(1)}>View More</h5>
            </div>
            <div className="outer">
              {data
                ? data.slice(10, 20).map((x, i) => (
                    <div
                      className="block"
                      key={i}
                      onClick={() => {
                        setDetail(x);
                        setComp(2);
                      }}
                    >
                      <img src={x.images[0].url} />
                      <h5 className="name">{x.name}</h5>
                      <h5 className="artist">{x.artists[0].name} </h5>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="second">
            <h4>Top 15 Albums</h4>
            <div className="container">
              {data
                ? data.slice(20, 35).map((a, b) => (
                    <div
                      className="contain"
                      key={b}
                      onClick={() => {
                        setDetail(a);
                        setComp(2);
                      }}
                    >
                      <h1>{convertNum(b + 1)}</h1>
                      <img src={a.images[0].url} />
                      <div className="names">
                        <h5 className="name">{a.name}</h5>
                        <h5 className="artist">{a.artists[0].name} </h5>
                      </div>
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

export default Albums;
