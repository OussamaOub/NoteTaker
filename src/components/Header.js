import React from "react";
import { ReactComponent as Avatar } from "../Gallery/avatar-default2.svg";
import { ReactComponent as Logoutsvg } from "../Gallery/logout.svg";
import { logout } from "../firebasestuff";
import { useNavigate } from "react-router-dom";

export default function Header() {
  let storedUser = localStorage.getItem("user");
  let user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.clear();
    console.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="header">
      <Logoutsvg className="logout" onClick={handleLogout} />
      {/* show three lines fore menu */}
      {/* <Menu className="menu" /> */}
      <p>Welcome {user.displayName}</p>
      {user.photoURL ? (
        <img src={user.photoURL} className="profilepic" />
      ) : (
        <Avatar className="avatar" />
      )}
    </div>
  );
}
