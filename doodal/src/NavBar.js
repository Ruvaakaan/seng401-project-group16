import { Link } from "react-router-dom";

function NavBar() {

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
          <Link to="/competition" className="items">Compete!</Link>
          <Link to="/draw" className="items">Draw!</Link>
          <button id="modeswitch" onClick={()=>document.body.classList.toggle("dark-mode")}>
            &#9681;
          </button>
          <Link to="/profile" className="items">
            <img src="" alt="Profile"></img>
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavBar;
