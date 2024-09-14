import React, { useEffect, useRef, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Landing from "../Landing/Landing";
import { CiSearch } from "react-icons/ci";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Albums from "../Albums/Albums";
import { CgProfile } from "react-icons/cg";
import Profile from "../Profile/Profile";
import "./Dashboard.css";
import { LuUser2 } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import UserService from "../../Service/UserService";
import toast from "react-hot-toast";
import {
  compareEncryptedData,
  encryptData,
  validateForm,
} from "../../Helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../Reducers/AuthReducer";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { ImCancelCircle } from "react-icons/im";
import { set } from "firebase/database";
import Loader from "../../Helper/Loader/Loader";
import Search from "../Search/Search";

const Dashboard = () => {
  // states
  const [comp, setComp] = useState(0);
  const [active, setActive] = useState(false);
  const [reg, setReg] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [sideModal, setSideModal] = useState(false);
  const [data, setData] = useState({});
  const checkbox = useRef(false);
  const dispatch = useDispatch();
  const auth = useSelector((x) => x.auth);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

  // subelementsArray
  const menus = [
    {
      name: "Discover",
      icon: <AiOutlineHome />,
      component: <Landing />,
    },
    {
      name: "Albums",
      icon: <MdOutlineLibraryMusic />,
      component: <Albums />,
    },
    {
      name: "Profile",
      icon: <CgProfile />,
      component: <Profile />,
    },
  ];
  const viewArray = [
    {
      component: (
        <Search
          data={search}
          setSearch={setSearch}
          refresh={refresh}
          handleChange={() => {
            setComp(0);
          }}
        />
      ),
    },
  ];

  // handling methods
  const handleReg = async (e) => {
    e.preventDefault();
    setLoader(true);
    const flag = validateForm(
      data.user_name,
      data.email,
      data.pass,
      data.cpass
    );

    if (flag) {
      console.log((await UserService.getUserByEmail(data.email)) == []);
      if ((await UserService.getUserByEmail(data.email)).length == 0) {
        if (data.pass == data.cpass) {
          const res = await UserService.create({
            ...data,
            pass: encryptData(data.pass),
            cpass: null,
          });
          console.log(res);
          toast.success("Registered Successfully!!");
          setReg(false);
          setData(" ");
          setLoginModal(true);
        } else {
          toast.error("Password not matched!");
        }
      } else {
        toast.error("User Already Exists!");
      }
    } else {
      toast.error("All fields are mandatory!");
    }
    setLoader(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    const flag = validateForm(data.email, data.pass);
    if (flag) {
      const res = await UserService.getUserByEmail(data.email);

      if (res.length === 0) {
        toast.error("User not registered!");
      } else {
        if (
          res[0].email.toLocaleLowerCase() === data.email.toLocaleLowerCase()
        ) {
          if (compareEncryptedData(data.pass, res[0].pass)) {
            dispatch(
              login({
                user: { ...res[0], pass: null, cpass: null },
                isRemember: checkbox.current.checked,
              })
            );
            toast.success("Logged in Successfully!");
            setData(" ");
            setLoginModal(false);
          } else {
            toast.error("Wrong Password!");
          }
        }
      }
    } else {
      toast.error("All fields are mandatory!");
    }
    setLoader(false);
  };
  const handleLogout = () => {
    setLoader(true);
    dispatch(logout());
    setSideModal(false);
    setLoader(false);
  };

  useEffect(() => {
    console.log(active);
    console.log(comp);
  }, [active, comp]);
  useEffect(() => {
    if (auth.isAuth) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className="main">
        <div className="left">
          <div className="top">
            <img src={require("../../Assests/logo.png")} alt="" />
            <h3>
              Tune<span>Box</span>
            </h3>
          </div>
          <div className="lower">
            {menus.map((obj, i) => (
              <div className="opt">
                <button
                  i={i}
                  className={i === comp ? "active" : ""}
                  onClick={() => {
                    setComp(i);
                    setActive((prev) => !prev);
                  }}
                >
                  {obj.icon}
                  <h5>{obj.name}</h5>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="right">
          <div className="head">
            <div className="top">
              <img src={require("../../Assests/logo.png")} alt="" />
              <h3>
                Tune<span>Box</span>
              </h3>
            </div>
            <div className="search">
              <input
                type="text"
                value={search}
                placeholder="Search Music Here."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />

              <CiSearch
                className="icon"
                onClick={() => {
                  if (search) {
                    if (comp === 3) {
                      setRefresh((prev) => !prev);
                    }
                    setComp(3);
                  }
                }}
              />
            </div>
            <div className="content">
              <p>
                <span>Trending Songs : </span>Dream your moments, Until I Met
                You,Gimme Some Courage,Dark Alley(+many more)
              </p>
            </div>
            {auth.isAuth ? (
              <div className="sidebar">
                <h5> {`Hello ${auth.user.user_name}`}</h5>
                <div className="symbol" onClick={() => setSideModal(true)}>
                  <h6>{`${auth.user.user_name.slice(0, 2)}`}</h6>
                </div>
              </div>
            ) : (
              <div className="btns">
                <button onClick={() => setReg(true)}>Register</button>
                <button onClick={() => setLoginModal(true)}>Login</button>
              </div>
            )}
          </div>
          <div className="box">
            {menus.map((x, i) => {
              if (i === comp) return x.component;
            })}
            {viewArray.map((a, b) => {
              if (comp === 3) return a.component;
            })}
          </div>
          <div className="bot">
            <div className="lower">
              {menus.map((obj, i) => (
                <div className="opt">
                  <button
                    i={i}
                    className={i === comp ? "active" : ""}
                    onClick={() => {
                      setComp(i);
                      setActive((prev) => !prev);
                    }}
                  >
                    {obj.icon}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {reg ? (
        <>
          <div className="modal">
            <div className="box">
              <h3>Register / Sign Up</h3>
              <div className="mid">
                {
                  <form>
                    <div className="info">
                      <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={data.user_name}
                        onChange={(e) => {
                          setData({
                            ...data,
                            user_name: e.target.value,
                          });
                        }}
                      />
                      <LuUser2 className="icon" />
                    </div>
                    <div className="info">
                      <input
                        type="text"
                        placeholder="Enter Your Email"
                        value={data.email}
                        onChange={(e) => {
                          setData({
                            ...data,
                            email: e.target.value,
                          });
                        }}
                      />
                      <TfiEmail className="icon" />
                    </div>
                    <div className="info">
                      <input
                        type="password"
                        placeholder="Enter Password"
                        value={data.pass}
                        onChange={(e) => {
                          setData({
                            ...data,
                            pass: e.target.value,
                          });
                        }}
                      />
                      <CiLock className="icon" />
                    </div>
                    <div className="info">
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={data.cpass}
                        onChange={(e) => {
                          setData({
                            ...data,
                            cpass: e.target.value,
                          });
                        }}
                      />
                      <CiLock className="icon" />
                    </div>
                  </form>
                }
              </div>
              <div className="bottom">
                <div className="btn">
                  <button onClick={(e) => handleReg(e)}>Register Now</button>
                  <button
                    onClick={() => {
                      setReg(false);
                      setData(" ");
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <h5>
                  Already Have An Account ?
                  <span
                    onClick={() => {
                      setReg(false);
                      setLoginModal(true);
                    }}
                  >
                    Login Here
                  </span>
                </h5>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {loginModal ? (
        <>
          <div className="modal">
            <div className="box">
              <h3>Login / Sign In</h3>
              <div className="mid">
                {
                  <form>
                    <div className="info">
                      <input
                        type="text"
                        placeholder="Enter Your Email"
                        value={data.email}
                        onChange={(e) => {
                          setData({
                            ...data,
                            email: e.target.value,
                          });
                        }}
                      />
                      <TfiEmail className="icon" />
                    </div>
                    <div className="info">
                      <input
                        type="password"
                        placeholder="Enter Password"
                        value={data.pass}
                        onChange={(e) => {
                          setData({
                            ...data,
                            pass: e.target.value,
                          });
                        }}
                      />
                      <CiLock className="icon" />
                    </div>
                    <div className="remember">
                      <input ref={checkbox} type="checkbox" name="remember" />
                      <label
                        onClick={() =>
                          (checkbox.current.checked = !checkbox.current.checked)
                        }
                        htmlFor="remember"
                      >
                        Remember Me
                      </label>
                    </div>
                  </form>
                }
              </div>
              <div className="bottom">
                <div className="btn">
                  <button
                    onClick={(e) => {
                      handleLogin(e);
                    }}
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => {
                      setLoginModal(false);
                      setData(" ");
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <h5>
                  Dont't Have An Account ?
                  <span
                    onClick={() => {
                      setLoginModal(false);
                      setReg(true);
                    }}
                  >
                    Register Here
                  </span>
                </h5>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {sideModal ? (
        <>
          <div className="modal">
            <div className="options">
              <div
                className="row"
                onClick={() => {
                  setComp(2);
                  setSideModal(false);
                }}
              >
                <CgProfile className="icon" />
                <h6>Edit Profile</h6>
              </div>
              <div className="row" onClick={() => handleLogout()}>
                <LuLogOut className="icon" />
                <h6>Logout</h6>
              </div>
              <div className="row" onClick={() => setSideModal(false)}>
                <ImCancelCircle className="icon" />
                <h6>Cancel</h6>
              </div>
            </div>
          </div>
          {loader ? (
            <Loader fullHeight={true} fullWidth={true} size={50} />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default Dashboard;
