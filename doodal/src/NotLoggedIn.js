import { Link } from "react-router-dom";

import "./Settings.css";

function notLoggedIn( {isOpen, onClose} ) {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-content" onClick={(e) => e.stopPropagation()}>
        <h2>Error, you are not logged in!</h2>
        <Link to="https://doodal.auth.us-west-2.amazoncognito.com/login?client_id=6c1og3jvcp62aqmkhjcgkjkvgq&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default notLoggedIn;
