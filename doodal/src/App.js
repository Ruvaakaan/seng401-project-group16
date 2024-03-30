import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./App.css";
import { ProfilePictureProvider } from "./ProfilePictureContext";
import { DarkModeProvider } from "./DarkModeContext";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import makeApiCall from "./makeApiCall";
import Modal from "react-bootstrap/Modal";

// Using context provider to declare authentication token globally

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pfp, setPfp] = useState(false);
  const navigate = useNavigate();
  //useEffect for getting initial credentials if needed
  useEffect(() => {
    const fetchData = async () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash);
      const accessToken = urlParams.get("access_token");

      if (accessToken) {
        // Checking url params for authentication
        Cookies.set("authentication", accessToken, { expires: 1 / 24 });
        setLoggedIn(true);
        navigate(window.location.pathname);

        try {
          const user = await makeApiCall(
            "https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/prod/getdata",
            "GET",
            ""
          );
          Cookies.set("userInfo", JSON.stringify(user));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Checking cookies for authentication
        const authenticationCookie = Cookies.get("authentication");
        if (authenticationCookie) {
          setLoggedIn(true);
        }
      }
      const unfinishedApiCall = localStorage.getItem("unfinishedapicall");
      try {
        if (unfinishedApiCall) {
          const { url, method, request } = JSON.parse(unfinishedApiCall);
          const match = url.match(/\/([^/]+)$/);
          if (match) {
            if (match[1] === "upload_drawing") {
              setText("Your drawing was posted!");
              handleShow();
            }
          }
          await makeApiCall(url, method, request);
        }
        localStorage.removeItem("unfinishedapicall");
      } catch (error) {
        console.log(error);
      }
      try {
        const userInfo = Cookies.get("userInfo");
        if (userInfo) {
          const profilePhotoUrl =
            JSON.parse(userInfo)["profile_photo_url"]["S"];
          setPfp(profilePhotoUrl);
        }
      } catch (error) {
        console.log("Error setting profile photo:", error);
      }
    };

    fetchData();
  }, []);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState("");
  return (
    <DarkModeProvider>
      <ProfilePictureProvider>
        <div className="App">
          <NavBar loggedIn={loggedIn} />
          <div>
            <Outlet />
            <Modal show={show} onHide={handleClose}>
              <Modal.Body>{text}</Modal.Body>
            </Modal>
          </div>
        </div>
      </ProfilePictureProvider>
    </DarkModeProvider>
  );
}
export default App;
