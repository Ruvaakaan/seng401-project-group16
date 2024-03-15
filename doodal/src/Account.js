import React, { useState, useEffect } from "react";
import Bio from "./Bio.js";
import ProfilePicture from "./ProfilePicture.js";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./Account.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getUserImages } from "./getUserImages.js";
import makeApiCall from "./makeApiCall";

function Account() {
  // Receive authenticationToken as a prop
  //User state
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  //Calculate the level based on experience points
  function calculateLevel(exp) {
    let level = 1;
    let expNeeded = 100;

    while (exp >= expNeeded) {
      level++;
      expNeeded += level * 100;
    }
    return level;
  }


  //Function to update user bio
  function updateBio(newBio) {
    setUser((prevUser) => ({
      ...prevUser,
      bio: newBio || prevUser.bio,
    }));
    setIsBioOpen(false);
  }

  // Function to handle editing the profile picture
  const handleEditProfile = () => {
    setIsProfilePopupOpen(true);
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = (file) => {
    console.log("File received:", file);
    if (!file) {
        console.error("No file received.");
        return;
    }
    const imageUrl = URL.createObjectURL(file);
    console.log("Temporary image URL:", imageUrl);
    if (!imageUrl) {
        console.error("Failed to create temporary image URL.");
        return;
    }
    console.log("Selected file:", file);
    setUser(prevUser => {
        console.log("Previous user state:", prevUser);

        if (!prevUser) {
            console.error("Previous user state is empty or undefined.");
            return null; // or any fallback value
        }

        const updatedUser = { ...prevUser, picture: imageUrl};
        console.log("Updated user state:", updatedUser);
        return updatedUser;
    });

    setIsProfilePopupOpen(false);
};

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/getdata`, "GET", {});
        console.log("response:", response)
        if (response) {
          setUser({
            // id: response.user_id.S,
            username: response.username.S,
            email: response.email.S,
            bio: response.bio.S, // You may want to set this to a default value or leave it empty initially
            picture: "https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg",
            exp: parseInt(response.experience.N), // Convert experience to a number
          });
          // Do something with userData, such as updating state
        } else {
          console.error("Failed to fetch user data");
          setUser({
            id: "example_id",
            picture: "https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg",
            username: "example_user",
            email: "example@example.com",
            bio: "Bio here",
            exp: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    async function fetchUserImages() {
      try {
        const images = await getUserImages();
        setPosts(images);
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    }

    fetchUserData();
    fetchUserImages();
    
  }, []);

  return (
    <div className="account-container">
      <div className="user-info">
        <div className="profile-picture-container">
            <img
                src={user.picture || "https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg"}
                alt="Profile Picture"
                className="profile-picture"
                onClick={handleEditProfile}
            />
            <span className="edit-profile" onClick={handleEditProfile}>
                <i className="fas fa-edit"></i>Edit
            </span>
        </div>
        <h2>
          Hello {user.username}!
        </h2>
        <div className="exp-bar">
          <h2>Level {calculateLevel(user.exp)}</h2>
          <div className="exp-progress">
            <div
              className="exp-fill"
              style={{
                width: `${
                  ((user.exp % (calculateLevel(user.exp) * 100)) /
                    (calculateLevel(user.exp) * 100)) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p>
            {user.exp % (calculateLevel(user.exp) * 100)} /{" "}
            {calculateLevel(user.exp) * 100} EXP
          </p>
        </div>
        <h2>
          Bio
          <span className="edit-icon" onClick={() => setIsBioOpen(true)}>
            &#xf044;
          </span>
        </h2>
        <p>{user.bio}</p>
      </div>

      <div className="image-gallery">
        <h2>Your Gallery</h2>
        <Row xs={3} className="g-4">
          {posts.map((url, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Img variant="top" src={url} />
                <Card.Body id="card"></Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Bio
        isOpen={isBioOpen}
        onClose={() => setIsBioOpen(false)}
        onUpdate={updateBio}
      />
      {isProfilePopupOpen && (
        <ProfilePicture
          onClose={() => setIsProfilePopupOpen(false)}
          onProfilePictureChange={handleProfilePictureChange}
        />
      )}
    </div>
  );
}

export default Account;
