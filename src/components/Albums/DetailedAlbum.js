import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertTime } from "../../Helper/Helper";
import Player from "../../Player/Player";

const DetailedAlbum = ({ detail }) => {
  // states
  const [source, setSource] = useState();
  const token = useSelector((x) => x.spotifyToken);
  const [comp, setComp] = useState(0);
  const [data, setData] = useState();

  const viewArray = [
    {
      component: (
        <Player
          data={{ ...data, images: detail.images }}
          isAlbum={true}
          isTrack={false}
        />
      ),
    },
  ];

  // rendering
  useEffect(() => {
    axios
      .get(
        `https://api.spotify.com/v1/albums/${detail.id}/tracks?limit=50&offset=0`,
        {
          headers: {
            Authorization: "Bearer " + token.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        setSource(res.data);
      })
      .catch(function (res) {
        if (res instanceof Error) {
          console.log(res.message);
        } else {
          console.log(res);
        }
      });
  }, []);

  return (
    <>
      {comp === 0 ? (
        <div className="song">
          <div className="up">
            <div className="lft">
              <img src={detail.images[0].url} />
            </div>
            <div className="rit">
              <h4>{detail.name}</h4>
              <h5>
                By-
                {detail.artists.map((x, i) => (
                  <h5 key={i}>{x.name}</h5>
                ))}
              </h5>
              <h5>Total Tracks:{detail.total_tracks} </h5>
              <h5>Released {detail.release_date}</h5>
              <button>Play All</button>
            </div>
          </div>
          <div className="down">
            <table>
              <thead>
                <tr>
                  <td>S.no</td>
                  <td>Song Title</td>
                  <td>Artist</td>
                  <td>Duration</td>
                </tr>
              </thead>
              <tbody>
                {source
                  ? source.items.map((a, b) => (
                      <tr
                        key={b}
                        onClick={() => {
                          setData(a);
                          setComp(1);
                        }}
                      >
                        <td>
                          <h4>{b + 1}</h4>
                        </td>
                        <td>
                          <h4>{a.name}</h4>
                        </td>
                        <td>
                          <h4>{a.artists[0].name}</h4>
                        </td>
                        <td>
                          <h4>{convertTime(a.duration_ms)} </h4>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        viewArray.map((nav, idx) => {
          if (idx + 1 === comp) return nav.component;
        })
      )}
    </>
  );
};

export default DetailedAlbum;
