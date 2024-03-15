import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./App.css";
import { DarkModeProvider } from "./DarkModeContext";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import makeApiCall from "./makeApiCall";

// Using context provider to declare authentication token globally

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();


  //useEffect for getting initial credentials if needed
  useEffect(() => {
    const fetchData = async () => {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash);
        const accessToken = urlParams.get("access_token");

        if (accessToken) { // Checking url params for authentication
            Cookies.set("authentication", accessToken, { expires: 1 / 24 });
            setLoggedIn(true);
            navigate(window.location.pathname);

            try {
                const user = await makeApiCall("https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/getdata", "GET", "");
                console.log(user)
                Cookies.set("userInfo", JSON.stringify(user));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else { // Checking cookies for authentication
            const authenticationCookie = Cookies.get("authentication");
            if (authenticationCookie) {
                setLoggedIn(true);
                const unfinishedApiCall = localStorage.getItem("unfinishedapicall");
                try {
                    if (unfinishedApiCall) {
                        const { url, method, request } = JSON.parse(unfinishedApiCall);
                        makeApiCall(url, method, request);
                    }
                    localStorage.removeItem("unfinishedapicall");
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    fetchData();
}, []);



  return (
    <DarkModeProvider>
      <div className="App">
        <NavBar loggedIn={loggedIn} />
        <div>
          <Outlet />
        </div>
      </div>
    </DarkModeProvider>
  );
}

export default App;
