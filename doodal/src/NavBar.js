import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DropdownMenu from "./DropdownMenu";
import makeApiCall from "./makeApiCall";
import './NavBar.css';

function NavBar({ loggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const fetchProfilePicture = async () => {
    try {
      const response = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/getdata`, "GET", {});
      console.log("response:", response)
      if (response) {
        setProfilePicture(response.profile_photo_url.S)
      } else {
        console.error("Failed to fetch profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  // Fetch profile picture only when logged in
  if (loggedIn) {
    fetchProfilePicture(); 
  }

  return (
    <>
      <div id="bar">
        <div className="logos">
          <img src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG" alt="logo" width={150}></img>
          <Link to="/home">
            <img src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/doodalnew.png" alt="doodal" width={275} id="doodal"></img>
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
                className={isDropdownOpen ? 'profile dropdown-opened reg-hover' : 'profile reg-hover'}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img src={profilePicture} alt="Account"></img>
              </div>
              {isDropdownOpen && <DropdownMenu/>}
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
