import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDarkMode } from './DarkModeContext';

function DropdownMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogOut = () => {
    if (Cookies.get("authentication")) {
      Cookies.remove("authentication");
      window.location.reload();
    }
  };

  return (
    <>
      <ul className="drop-menu">
      <hr class="breakline"></hr>
        <li className="drop-items">
          <Link to="/profile" className="drop-items reg-hover">
            <i class="fa-solid fa-user drop-icons"></i> Profile
          </Link>
        </li>
        <hr class="breakline"></hr>
        <li onClick={() => handleLogOut()} className="drop-items reg-hover">
          <i class="drop-icons fa-solid fa-right-from-bracket"></i> Logout
        </li>
        <hr class="breakline"></hr>
        <li>
          <button
            id="modeswitch"
            onClick={toggleDarkMode}
          >
            &#9681;
          </button>
        </li>
      </ul>
    </>
  );
}

export default DropdownMenu;
