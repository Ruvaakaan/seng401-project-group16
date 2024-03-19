import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./Account.css";
import { Navigate } from 'react-router-dom';
import Popup from "./PopUp.js";
import makeApiCall from "./makeApiCall.js";
import { timeConverter } from "./TimeConverter.js";

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
  const [selectedImageCreationDate, setSelectedImageCreationDate] = useState(null);
  const [selectedImageDrawingID, setSelectedImageDrawingID] = useState(null);
  const [selectedUserLiked, setSelectedUserLiked] = useState(null);
  const [selectedCompetitionID, setSelectedCompetitionID] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);

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

  useEffect(()=>{
    setShowPopUp(false)
    fetchUserData();
    fetchUserImages();
  }, [username])


  const fetchUserData = async () => {
    try {
      const response = await makeApiCall(
        `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_user_info_by_username`,
        "POST",
        {username: username}
      );
      // console.log("response:", response);
      if (response) {
        const responseBody = JSON.parse(response.body);
        console.log(responseBody)
        setUser({
          // id: response.user_id.S,
          username: responseBody.username.S,
          email: responseBody.email.S,
          bio: responseBody.bio.S, // You may want to set this to a default value or leave it empty initially
          picture: responseBody.profile_photo_url.S,
          likes: 0
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
      const response = await makeApiCall(
        `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_users_drawings`,
        "POST",
        {username: username}
      );
      let image_list = [];

      for (let i = 0; i < response.items.length; i++) {
        let itemToAdd = {};
        itemToAdd.competition_id = response.items[i].competition_id.S;
        itemToAdd.date_created = response.items[i].date_created.S;
        itemToAdd.drawing_id = response.items[i].drawing_id.S;
        itemToAdd.likes = response.items[i].likes.N;
        itemToAdd.s3_url = response.items[i].s3_url.S;
        itemToAdd.username = response.items[i].username.S;
        itemToAdd.liked_by_user = response.items[i].liked_by_user;
        image_list.push(itemToAdd);
      }
      var total = 0
      for (let i=0; i < image_list.length; i++){
        total += Number(image_list[i]["likes"])
      }
      setTotalLikes(total);
      setPosts(image_list);
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
            src={user.picture || "https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"}
            alt="Profile Picture"
            className="profile-picture"
          />
        </div>
        <div className="account-info">
        <h2 className="username-profile">{user.username}</h2>
        <div className="likes">
          <h2>@{user.username} ‧ Total Likes: {totalLikes} <i className="fa-solid fa-heart fa-2xs"></i></h2>
        </div>
        <div className ="bio">
        <p>{user.bio}</p>
        </div>
        </div>
      </div>

      <div className="image-gallery">
        <h2>{username}'s Submissions</h2>
        <Row xs={3} className="g-4">
          {posts.map((item, idx) => (
            <Col key={idx}>
              <Card >
                <Card.Img
                  className="photo-card"
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
                <Card.Body id="account-card">
                  <p className="account-post-date">Posted {timeConverter(item.date_created)}</p>
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
          posterPfp={user.picture}
        />
      )}
    </div>
  );
}

export default ViewAccount;
