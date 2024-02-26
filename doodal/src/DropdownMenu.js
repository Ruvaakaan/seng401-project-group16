import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function DropdownMenu() {
  const handleLogOut = () => {
    if (Cookies.get("authentication")) {
      Cookies.remove("authentication");
      window.location.reload();
    }
  };

  return (
    <>
      <ul className="drop-menu">
        <li>
          <Link to="/profile" className="drop-items">
            <img src="" alt="Profile"></img>
          </Link>
        </li>
        <li onClick={() => handleLogOut()} className="drop-items">Logout</li>
        <li>
          <button
            id="modeswitch"
            onClick={() => document.body.classList.toggle("dark-mode")}
          >
            &#9681;
          </button>
        </li>
      </ul>
    </>
  );
}

export default DropdownMenu;
