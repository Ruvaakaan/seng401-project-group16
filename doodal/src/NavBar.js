import { Link } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [logged, setLogged] = useState(false);

  function loginuser() {
    // empty for now until cognito is figured out
    // temp code

    setLogged(true);
  }

  return (
    <>
      <div id="bar">
        <div className="logos">
          <img src="octopus.PNG" alt="logo" width={150}></img>
          <Link to="/home">
            <img src="doodal.PNG" alt="doodal" width={275} id="doodal"></img>
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
          {logged ? (
            <Link to="/profile" className="items">
              <img src="" alt="Profile"></img>
            </Link>
          ) : (
            <button id="login" className="items" onClick={()=>loginuser()}>Login</button>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
