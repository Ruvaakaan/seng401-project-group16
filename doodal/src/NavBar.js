import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

function NavBar({authenticationToken}) {

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
          <Link to="/gallery" className="items">
            Gallery
          </Link>
          <Link to="/draw" className="items">
            Draw
          </Link>
          <button
            id="modeswitch"
            onClick={() => document.body.classList.toggle("dark-mode")}
          >
            &#9681;
          </button>
          {authenticationToken !== null ? (
            <Link to="/profile" className="items">
              <img src="" alt="Profile"></img>
            </Link>
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
