import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
