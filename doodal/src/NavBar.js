import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Image } from "react-bootstrap";
import { useProfilePicture } from "./ProfilePictureContext";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
  Button,
  Dropdown,
} from "react-bootstrap";

import { useDarkMode } from "./DarkModeContext";

function NavBar({ loggedIn }) {
  const { profilePictureUrl } = useProfilePicture();
  const userInfoCookie = Cookies.get("userInfo");
  const profilePhotoUrl = userInfoCookie
    ? JSON.parse(userInfoCookie)["profile_photo_url"]["S"]
    : "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG";

  const handleLogOut = () => {
    Cookies.remove("authentication");
    Cookies.remove("userInfo");
    window.location.href = "/home";
  };

  const redirectTo = `https://doodal.auth.us-west-2.amazoncognito.com/login?client_id=6c1og3jvcp62aqmkhjcgkjkvgq&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${encodeURIComponent("https://seng401-project-group16.vercel.app/")}`;
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <>

      <Navbar className="purple-navbar" style={{ height: "100px" }}>
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Navbar.Brand>
            <Nav.Link>
              <Link to="/home">
                <Image
                  src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
                  style={{ width: "75px", margin: "10px" }}
                />
              </Link>
            </Nav.Link>
            {/* DOODAL */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link to="/home" className="nav-link-custom">
                  Home
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/gallery" className="nav-link-custom">
                  Gallery
                </Link>
              </Nav.Link>
            </Nav>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Image
                src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/doodalnew.png"
                style={{ width: "150px" }}
              />
            </div>
            {loggedIn !== false ? (
              <Nav>
                <NavDropdown
                  className="custom-dropdown"
                  align="end"
                  title={
                    <Image
                      className="nav-link-custom"
                      src= {profilePictureUrl || profilePhotoUrl}
                      roundedCircle
                    />
                  }
                >
                  <NavDropdown.Item className="navbar-profile-dropdown">
                    <Link to="/profile" className="profile-link">
                      <i
                        className="fa-solid fa-user drop-icons"
                        style={{ marginRight: "9px" }}
                      ></i>
                      Profile
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleLogOut()}>
                    <i
                      className="fas fa-right-from-bracket"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Logout
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={toggleDarkMode}>
                    <i
                      className="fa-solid fa-circle-half-stroke"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Dark Mode
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                {/* <Nav.Link> */}
                  <Link
                    to={redirectTo}
                    className="nav-link-custom-extra"
                  >
                    Login
                  </Link>
                {/* </Nav.Link> */}
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
