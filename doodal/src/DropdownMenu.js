import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDarkMode } from "./DarkModeContext";

function DropdownMenu() {


  const handleLogOut = () => {
    Cookies.remove("authentication");
    Cookies.remove("userInfo");
    window.location.reload();
  };

  return (
    <>
      <ul className="drop-menu">
        <hr className="breakline"></hr>
        <li className="drop-items">
          <Link to="/profile" className="drop-items reg-hover">
            <i className="fa-solid fa-user drop-icons"></i> Profile
          </Link>
        </li>
        <hr className="breakline"></hr>
        <li onClick={() => handleLogOut()} className="drop-items reg-hover">
          <i className="drop-icons fa-solid fa-right-from-bracket"></i> Logout
        </li>
        <hr className="breakline"></hr>
        <li>
          <button id="modeswitch" onClick={toggleDarkMode}>
            &#9681;
          </button>
        </li>
      </ul>
    </>
  );
}

export default DropdownMenu;
