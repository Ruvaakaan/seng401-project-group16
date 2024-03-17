import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DropdownMenu from "./DropdownMenu";

import Cookies from "js-cookie";
import { Image } from "react-bootstrap";

function NavBar({ loggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userInfoCookie = Cookies.get("userInfo");
  const profilePhotoUrl = userInfoCookie
    ? JSON.parse(userInfoCookie)["profile_photo_url"]
    : null;

  return (
    <>
      <div id="bar">
        <div className="logos">
          <img
            src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
            alt="logo"
            width={150}
          ></img>
          <Link to="/home">
            <img
              src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/doodalnew.png"
              alt="doodal"
              width={275}
              id="doodal"
            ></img>
          </Link>
        </div>
        <div className="nav">
          <Link to="/home" className="items">
            Home
          </Link>
          <Link to="/gallery" className="items">
            Gallery
          </Link>
          {loggedIn !== false ? (
            <div className="dropdown-click">
              <div
                className={
                  isDropdownOpen
                    ? "profile dropdown-opened reg-hover"
                    : "profile reg-hover"
                }
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >

                <Image
                  src={
                    profilePhotoUrl
                      ? profilePhotoUrl
                      : "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
                  }
                  roundedCircle
                  className="profile-photo-nav"
                />
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
