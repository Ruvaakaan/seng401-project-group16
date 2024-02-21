import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./App.css";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Using context provider to declare authentication token globally

function App() {
  const [authenticationToken, setAuthenticationToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access_token in URL params
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      // Store the access token in a cookie named "authentication"
      Cookies.set("authentication", accessToken);
      setAuthenticationToken(accessToken);
      // Clear the URL params from the URL
      navigate(window.location.pathname);
    } else {
      // Check cookies for auth token
      const authenticationCookie = Cookies.get("authentication");

      if (authenticationCookie) {
        setAuthenticationToken(authenticationCookie);
      }
    }
  }, []);

  return (
    <div className="App">
      <NavBar authenticationToken={authenticationToken} />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
