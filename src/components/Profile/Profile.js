import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "../../Service/UserService";
import toast from "react-hot-toast";
import Loader from "../../Helper/Loader/Loader";
import { compareEncryptedData, encryptData } from "../../Helper/Helper";
import "./Profile.css";

const Profile = () => {
  // states
  const auth = useSelector((x) => x.auth);
  const [data, setData] = useState();
  const [info, setInfo] = useState();
  const [loader, setLoader] = useState(false);

  // methods
  const getUser = async () => {
    const res = await UserService.read(auth.user.id);
    console.log(res);
    setData({ ...res, cpass: res.pass });
    setInfo({ ...res, cpass: res.pass });
  };
  const updateProfile = async (info) => {
    setLoader(true);
    if (info != data) {
      console.log(
        info.pass,
        info.cpass,
        compareEncryptedData(info.cpass, info.pass)
      );
      if (
        compareEncryptedData(info.cpass, info.pass) ||
        info.cpass == info.pass
      ) {
      
        const res = await UserService.update(auth.user.id, {
          ...info,
          cpass: null,
        });
        toast.success("Profile Updated Successfully!");
        setInfo();
       
      } else {
        toast.error("Password and Confirm Password does'nt match!");
      }
    } else {
      toast.error("No information is being changed!");
    }
    setLoader(false);
  };

  // rendering
  
  useEffect(() => {
    if (auth.isAuth) {
      getUser();
    }
  }, []);
  return (
    <>
      {auth.isAuth ? (
        loader ? (
          <Loader size={50} fullHeight={true} fullWidth={true} />
        ) : (
          <div className="profile">
            <div className="card">
              <div className="info">
                <div className="circle">
                  <h1>{`${auth.user.user_name.slice(0, 2)}`}</h1>
                </div>
              </div>
              {data ? (
                <div className="info1">
                  <div className="container">
                    <label htmlFor="">Your Name *</label>
                    <input
                      type="text"
                      placeholder={data.user_name}
                      onChange={(e) => {
                        setInfo({
                          ...info,
                          user_name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="container">
                    <label htmlFor="">Your Email *</label>
                    <input
                      type="text"
                      placeholder={data.email}
                      onChange={(e) => {
                        setInfo({
                          ...info,
                          email: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="container">
                    <label htmlFor="">Your Password *</label>
                    <input
                      type="password"
                      
                      onChange={(e) => {
                        setInfo({
                          ...info,
                          pass: encryptData(e.target.value),
                        });
                      }}
                    />
                  </div>
                  <div className="container">
                    <label htmlFor="">Confirm Password *</label>
                    <input
                      type="password"
                      onChange={(e) => {
                        setInfo({
                          ...info,
                          cpass: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Loader size={50} fullHeight={true} fullWidth={true} />
              )}
              <div className="btns">
                <button onClick={() => updateProfile(info)}>Save</button>
                <button onClick={() => setInfo({})}>Cancel</button>
              </div>
            </div>
          </div>
        )
      ) : (
        <h1 className="not-signned">User Not Signed In!!</h1>
      )}
    </>
  );
};

export default Profile;
