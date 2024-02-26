import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DropdownMenu from "./DropdownMenu";

function NavBar({ authenticationToken }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div id="bar">
        <div className="logos">
          <img src="octopus.PNG" alt="logo" width={150}></img>
          <Link to="/home">
            <img src="doodalnew.PNG" alt="doodal" width={275} id="doodal"></img>
          </Link>
        </div>
        <div className="nav">
          <Link to="/home" className="items">
            Home
          </Link>
          <Link to="/gallery" className="items">
            Gallery
          </Link>
          <Link to="/draw" className="items">
            Draw
          </Link>
          {authenticationToken !== null ? (
            <div className="dropdown">
              <div
                className={isDropdownOpen ? 'items dropdown-opened' : 'items'}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img src="" alt="Profile"></img>
              </div>
              {isDropdownOpen && <DropdownMenu />}
            </div>
          ) : (
            <Link
              to="https://doodal.auth.us-west-2.amazoncognito.com/login?client_id=6c1og3jvcp62aqmkhjcgkjkvgq&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F"
              className="items"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
