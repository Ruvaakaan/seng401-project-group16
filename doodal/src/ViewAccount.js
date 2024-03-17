import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./Account.css";
import { getUserImages } from "./getUserImages.js";
import makeApiCall from "./makeApiCall";
import { Navigate } from 'react-router-dom';
import Popup from "./PopUp.js";

function ViewAccount() {
  // Receive authenticationToken as a prop
  //User state
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
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
        alert("Invalid Username");
        setRedirectToHome(true);
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

  useEffect(() => {
    fetchUserData();
    fetchUserImages();
  }, []);

  const handleShow = (image, drawingID, compID) => {
    setSelectedImage(image);
    setSelectedImageDrawingID(drawingID);
    setSelectedCompetitionID(compID);
    setShow(true);
  };

  if (redirectToHome) {
    return <Navigate to="/" />;
  }

  return (
    <div className="account-container">
      <div className="user-info">
        <div className="profile-picture-container">
            <img
                src={user.picture || "https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg"}
                alt="Profile Picture"
                className="profile-picture"
            />
        </div>
        <h2>
          {user.username}'s Profile
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

export default ViewAccount;
