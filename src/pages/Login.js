import React, { useState } from "react";
import {
  loginwithemailandpassword,
  loginwithgoogle,
  signupwithemail,
} from "../firebasestuff";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserProvider";
import Swal from "sweetalert2";
import "../App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    const user = await signupwithemail(email, password, username).then(
      (user) => {
        if (typeof user !== "string") {
          handleLogin(email, password);
        } else {
          const temp = user.split("/");
          let errorcode =
            temp && temp.length > 1 ? temp[1].replace(/\)\./g, " ") : "";
          errorcode = errorcode.replace(/-/g, " ");
          // capitalize first letter
          errorcode = errorcode.charAt(0).toUpperCase() + errorcode.slice(1);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: errorcode,
            confirmButtonText: "OK",
            // change button styling
            showConfirmButton: false,
            showCloseButton: true,
            color: "#fff",
            background: `linear-gradient( #0f0c29, #302b63, #24243e)`,
          });
          setLoading(false);
        }
      }
    );
  };

  const handleLogin = async () => {
    setLoading(true);
    const user = await loginwithemailandpassword(email, password);
    // check if user is a string
    if (typeof user !== "string") {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      const expirationTime = 3600;
      const tokenExpiration = new Date().getTime() + expirationTime * 1000;
      localStorage.setItem("token", user.token);
      localStorage.setItem("tokenExpiration", tokenExpiration);
      navigate("/Welcome", { replace: true });
    }
    // if user is a string, then it is an error
    else {
      const temp = user.split("/");
      let errorcode = temp[1].replace(/\)\./g, " ");
      errorcode = errorcode.replace(/-/g, " ");
      // capitalize first letter
      errorcode = errorcode.charAt(0).toUpperCase() + errorcode.slice(1);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorcode,
        confirmButtonText: "OK",
        // change button styling
        showConfirmButton: false,
        showCloseButton: true,
        color: "#fff",
        // change background color to linear gradient of body
        background: `linear-gradient( #0f0c29, #302b63, #24243e)`,
      });
      setLoading(false);
    }
  };

  const handleloginwithgoogle = async () => {
    setLoading(true);
    const user = await loginwithgoogle();
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    const expirationTime = 3600;
    const tokenExpiration = new Date().getTime() + expirationTime * 1000;
    localStorage.setItem("token", user.token);
    localStorage.setItem("tokenExpiration", tokenExpiration);

    navigate("/Welcome", { replace: true });
    setLoading(false);
  };

  const emailtester = () => {
    // check email format
    if (email.length > 0) {
      const emailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailformat.test(email);
    }
  };

  return (
    <div
      className="main"
      // style={{
      // width depends on the screen size
      // width: window.innerWidth > 700 ? "40vw" : "80vw",
      // }}
    >
      {loading === false ? (
        <>
          <div className="signup">
            <form>
              <label htmlFor="chk" aria-hidden="true">
                Login
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                // prevent default
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                style={{
                  width: "60%",
                }}
              >
                Login
              </button>
              <div
                className="loginproviders"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <div
                  className="google"
                  onClick={(e) => {
                    handleloginwithgoogle();
                  }}
                ></div>
                {/* <div
                  className="discord"
                  onClick={(e) => {
                    handleloginwithdiscord();
                  }}
                ></div> */}
              </div>
            </form>
          </div>
          <input
            type="checkbox"
            id="chk"
            aria-hidden="true"
            hidden
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <div className="login">
            <form>
              <label htmlFor="chk" aria-hidden="true">
                Sign up
              </label>
              <input
                type="text"
                name="txt"
                placeholder="User name"
                required=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={(e) => {
                  e.target.style.textAlign = "left";
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailtester() === false ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 12,
                    textAlign: "center",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    // top: 0,
                    left: "50%",
                    transform: "translate(-50%, -130%)",
                  }}
                >
                  Invalid email format
                </p>
              ) : (
                <></>
              )}
              <input
                type="password"
                name="pswd"
                placeholder="Password"
                required=""
              />
              <button
                // prevent default
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
                style={{
                  width: "60%",
                }}
              >
                Sign up
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
}
