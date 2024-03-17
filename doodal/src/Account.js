import React, { useState, useEffect } from "react";
import Bio from "./Bio.js";
import ProfilePicture from "./ProfilePicture.js";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Account.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getUserImages } from "./getUserImages.js";
import makeApiCall from "./makeApiCall";
import Popup from "./PopUp.js";
import { delPost } from "./DeletePost.js";

function Account() {
  // Receive authenticationToken as a prop
  //User state
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUserName, setSelectedImageUserName] = useState(null);
  const [selectedImageCreationDate, setSelectedImageCreationDate] =
    useState(null);
  const [selectedImageDrawingID, setSelectedImageDrawingID] = useState(null);
  const [selectedUserLiked, setSelectedUserLiked] = useState(null);
  const [selectedCompetitionID, setSelectedCompetitionID] = useState(null);

  const handlePopup = (
    image,
    username,
    dateCreated,
    drawingID,
    userLiked,
    compID
  ) => {
    setSelectedImage(image);
    setSelectedImageUserName(username);
    setSelectedImageCreationDate(dateCreated);
    setSelectedImageDrawingID(drawingID);
    setSelectedUserLiked(userLiked);
    setSelectedCompetitionID(compID);
    setShowPopUp(true);
  };

  const handleClosePopUp = async () => {
    fetchUserImages();
    setShowPopUp(false);
  };

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
    if (!file) {
      console.error("No file received.");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    if (!imageUrl) {
      console.error("Failed to create temporary image URL.");
      return;
    }
    setUser((prevUser) => {
      // console.log("Previous user state:", prevUser);

      if (!prevUser) {
        console.error("Previous user state is empty or undefined.");
        return null; // or any fallback value
      }

      const updatedUser = { ...prevUser, picture: imageUrl };
      console.log("Updated user state:", updatedUser);
      return updatedUser;
    });
    setIsProfilePopupOpen(false);
  };


  const fetchUserData = async () => {
    try {
      const response = await makeApiCall(
        `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/getdata`,
        "GET",
        {}
      );
      // console.log("response:", response);
      if (response) {
        setUser({
          // id: response.user_id.S,
          username: response.username.S,
          email: response.email.S,
          bio: response.bio.S, // You may want to set this to a default value or leave it empty initially
          picture: response.profile_photo_url.S,
          exp: parseInt(response.experience.N), // Convert experience to a number
        });
        // Do something with userData, such as updating state
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserImages = async () => {
    try {
      const images = await getUserImages();
      setPosts(images);
    } catch (error) {
      console.error("Error fetching user images:", error);
    }
  };

  const handleDeletePost = async () => {
    await delPost(selectedImageDrawingID, selectedCompetitionID);
    fetchUserImages();
    setShow(false);
  };

  const handleClose = () => setShow(false);

  const handleShow = (image, drawingID, compID) => {
    setSelectedImage(image);
    setSelectedImageDrawingID(drawingID);
    setSelectedCompetitionID(compID);
    setShow(true);
  };

  useEffect(() => {
    fetchUserData();
    fetchUserImages();
  }, []);

  return (
    <div className="account-container">
      <div className="user-info">
        <div className="profile-picture-container">
          <img
            src={
              user.picture ||
              "https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg"
            }
            alt="Profile Picture"
            className="profile-picture"
            onClick={handleEditProfile}
          />
          <span className="edit-profile" onClick={handleEditProfile}>
            <i className="fas fa-edit"></i>Edit
          </span>
        </div>
        <h2>Hello {user.username}!</h2>
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
          {posts.map((item, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Img
                  variant="top"
                  src={item["s3_url"]}
                  onClick={() =>
                    handlePopup(
                      item.s3_url,
                      item.username,
                      item.date_created,
                      item.drawing_id,
                      item.liked_by_user,
                      item.competition_id
                    )
                  }
                />
                <Card.Body id="card">
                  <i
                    className="fa-solid fa-trash comment-action-icon"
                    onClick={() =>
                      handleShow(
                        item.s3_url,
                        item.drawing_id,
                        item.competition_id
                      )
                    }
                  ></i>
                </Card.Body>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Img variant="top" src={selectedImage} />
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleDeletePost()}>
            Delete!
          </Button>
        </Modal.Footer>
      </Modal>

      {showPopUp && (
        <Popup
          show={showPopUp}
          handleClose={handleClosePopUp}
          selectedImage={selectedImage}
          username={selectedImageUserName}
          prompt={prompt}
          dateCreated={selectedImageCreationDate}
          drawingID={selectedImageDrawingID}
          liked={selectedUserLiked}
        />
      )}
    </div>
  );
}

export default Account;
