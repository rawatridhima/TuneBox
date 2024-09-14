import React, { useEffect, useState } from "react";
import Player from "../../Player/Player";
const AllTracks = ({ data }) => {
  // states
  const [detail, setDetail] = useState();

  return (
    <>
      {detail ? (
        <Player detail={detail} isAlbum={false} isTrack={true} />
      ) : (
        <div className="members">
          {data
            ? data.map((x, i) => (
                <div
                  className="member"
                  key={i}
                  onClick={() => {
                    setDetail(x);
                  }}
                >
                  <img src={x.album.images[0].url} />
                  <h5 className="name">{x.name}</h5>
                  <h5 className="artist">{x.artists[0].name} </h5>
                </div>
              ))
            : null}
        </div>
      )}
    </>
  );
};

export default AllTracks;
