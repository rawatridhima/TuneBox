import React, { useEffect, useRef, useState } from "react";
import { FaStepBackward, FaStepForward } from "react-icons/fa";
import {
  MdOutlinePauseCircleFilled,
  MdOutlinePlayCircleFilled,
} from "react-icons/md";
import "./Player.css";
import { formatTime } from "../Helper/Helper";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../Helper/Loader/Loader";

const Player = ({ detail, isAlbum, isTrack, data }) => {
  // states
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlay, setIsPlay] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [track, setTrack] = useState([]);
  const token = useSelector((x) => x.spotifyToken);
  const [current, setCurrent] = useState("");

  // console.log(current.images[0].url);
  const [pointer, setPointer] = useState(0);
  const [trackStatus, setTrackStatus] = useState(isTrack);
  const [albumStatus, setAlbumStatus] = useState(isAlbum);

  // method
  const handleProgressClick = (event) => {
    const progressBarWidth = progressBarRef.current.offsetWidth;
    const clickPosition = event.nativeEvent.offsetX;
    const clickPercentage = clickPosition / progressBarWidth;
    const newTime = clickPercentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleNext = () => {
    setCurrent((prev) => {
      setTrackStatus(true);
      setAlbumStatus(false);
      const val = track[pointer];
      setPointer((prev) => prev + 1);
      return val;
    });
  };
  const handlePrevious = () => {
    setCurrent((prev) => {
      setTrackStatus(true);
      setAlbumStatus(false);
      setPointer((prev) => prev - 1);
      const val = track[pointer - 2];
      console.log(val);
      return val;
    });
  };
  const getTracks = async () => {
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
        setTrack(res.data.tracks);
      })
      .catch(function (res) {
        if (res instanceof Error) {
          console.log(res.message);
        } else {
          console.log(res.data);
        }
      });
  };
  // rendering
  useEffect(() => {
    if (audioRef.current) {
      if (!isPlay) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlay]);

  useEffect(() => {
    if (currentTime >= duration) {
      handleNext();
    }
  }, [currentTime]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    console.log(pointer);
  }, [pointer]);
  useEffect(() => {
    setCurrent((prev) => {
      if (isAlbum) return data;
      else return detail;
    });
    getTracks();
  }, []);
  useEffect(() => {
    console.log(current);
  }, [current]);

  if (!current) return <Loader size={50} fullHeight={true} fullWidth={true} />;
  else
    return (
      <React.Fragment>
        <audio
          autoPlay
          ref={audioRef}
          src={require("../Assests/music.mp3")}
          preload={"auto"}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        />

        {trackStatus ? (
          <div className="play">
            <div className="top">
              <h3>Now Playing</h3>
            </div>
            <div className="lower">
              <div className="image">
                <img src={current?.album?.images[0].url} alt="" />
              </div>
              <div className="mid">
                <h2>{current.name}</h2>
                <h4>{current.artists[0].name}</h4>
              </div>
              <div className="part">
                <h3>{formatTime(currentTime)}</h3>
                <div
                  className="cover"
                  ref={progressBarRef}
                  onClick={(e) => handleProgressClick(e)}
                >
                  <div
                    className="line"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <h3>{formatTime(duration)}</h3>
              </div>
              <div className="low">
                {pointer == 1 ? null : (
                  <FaStepBackward className="icon" onClick={handlePrevious} />
                )}

                {isPlay ? (
                  <MdOutlinePauseCircleFilled
                    className="icon"
                    onClick={() => setIsPlay(false)}
                  />
                ) : (
                  <MdOutlinePlayCircleFilled
                    className="icon"
                    onClick={() => setIsPlay(true)}
                  />
                )}
                <FaStepForward className="icon" onClick={handleNext} />
              </div>
            </div>
          </div>
        ) : albumStatus ? (
          <div className="play">
            <div className="top">
              <h3>Now Playing</h3>
            </div>
            <div className="lower">
              <div className="image">
                <img src={current.images[0].url} />
              </div>
              <div className="mid">
                <h2>{current.name}</h2>
                <h4>{current.artists[0].name}</h4>
              </div>
              <div className="part">
                <h3>{formatTime(currentTime)}</h3>
                <div
                  className="cover"
                  ref={progressBarRef}
                  onClick={(e) => handleProgressClick(e)}
                >
                  <div
                    className="line"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <h3>{formatTime(duration)}</h3>
              </div>
              <div className="low">
                {pointer == 1 ? null : (
                  <FaStepBackward className="icon" onClick={handlePrevious} />
                )}
                {isPlay ? (
                  <MdOutlinePauseCircleFilled
                    className="icon"
                    onClick={() => setIsPlay(false)}
                  />
                ) : (
                  <MdOutlinePlayCircleFilled
                    className="icon"
                    onClick={() => setIsPlay(true)}
                  />
                )}
                <FaStepForward className="icon" onClick={handleNext} />
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
};

export default Player;
