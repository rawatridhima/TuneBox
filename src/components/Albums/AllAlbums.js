import React, { useState } from "react";
import DetailedAlbum from "./DetailedAlbum";

const AllAlbums = ({ data }) => {
  // states
  const [detail, setDetail] = useState();

  return (
    <>
      {detail ? (
        <DetailedAlbum detail={detail} />
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
                  <img src={x.images[0].url} />
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

export default AllAlbums;
