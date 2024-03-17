import { useEffect, useState, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { sortImages } from "./sortDrawings.js";
import { likeUnlike } from "./LikeAndUnlike.js";
import "./Gallery.css";
import Popup from "./PopUp.js";

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([]); // array of all posts liked by user
  const [images, setImages] = useState([]); // array of images
  const [userEnter, setUserEnter] = useState(false); // determines if in the main gallery or in a competition page
  const [title, setTitle] = useState("Gallery"); // title of page
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUserName, setSelectedImageUserName] = useState(null);
  const [selectedImageCreationDate, setSelectedImageCreationDate] = useState(null);
  const [selectedImageDrawingID, setSelectedImageDrawingID] = useState(null);
  const [sortType, setSortType] = useState("likes-descend");

  const nav = useNavigate();
  const {version} = useParams();

  const location = useLocation();
  const prompt = location.state?.prompt; // get prompt as prop
  const comp_id = location.state?.comp_id; // get competition id as prop


  const handleImageClick = (image, username, dateCreated, drawingID) => {
    setSelectedImage(image);
    setSelectedImageUserName(username);
    setSelectedImageCreationDate(dateCreated);
    setSelectedImageDrawingID(drawingID);
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    callSorter(sortType); // this pretty much refreshes the gallery in case the user likes within the popup. updates the icon and like count (will not work with random filter)
    setShowPopUp(false);
  }

  const fetchData = useCallback(async () => {
    const prompt = location.state?.prompt;
    if (!prompt){
      setTitle("Gallery")
      setUserEnter(false)
    }
    else{
      setTitle(prompt)}
    let data = await callSorter(sortType);
    if (!data) {
      return;
    }
    setImages(data);
  }, [location, version]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // when loaded, check if we are in a competiion or main gallery, do stuff based on where
    if (prompt) {
      setTitle(prompt);
      setUserEnter(true);
    }
    callSorter(sortType);
  }, []);

  function like_change(val) {
    // this function changes the heart icon for liking and unliking
    if (user_likes.includes(val)) {
      setUserLikes(user_likes.filter((item) => item !== val));
      return;
    }
    setUserLikes([...user_likes, val]);
  }

  const handleLikes = async (id) => {
    let val = await likeUnlike(id);
    if (val) {
      // Update the likes property of the corresponding image item
      setImages((prevImages) => {
        return prevImages.map((image) => {
          if (image.drawing_id === id) {
            // Toggle the likes count based on whether the user has liked or unliked the image
            image.likes =
              parseInt(image.likes, 10) + (user_likes.includes(id) ? -1 : 1);
            return { ...image };
          }
          return image;
        });
      });
      like_change(id);
    }
  };

  const callSorter = async (s) => {
    setSortType(s);
    var i = comp_id ? comp_id : ""; // if in a comp, pass in comp id, else it is empty for no compettion
    let body = await sortImages(s, i, -1); // s is sort type, i is competition id, -1 is for amount which returns all
    if (!body) {
      return;
    }
    let arr = []
    for (let i=0;i<body.length;i++){
      if (body[i]["liked_by_user"] == true){
        arr.push(body[i]["drawing_id"]);
      }
    }

    setUserLikes(arr);
    setImages(body);
  };

  // useEffect(() => {
  //   console.log("images:", images); // debugging
  // }, [images]);

  // useEffect(() => {
  //   console.log(user_likes);
  // }, [user_likes]);

  return (
    <>
      <div className="gallery-banner">
        <div className="gallery-title">
          <h1>
            {title}
            {userEnter && (
              <Button
                variant="outline-dark"
                className="entry-button"
                onClick={() =>
                  nav("/draw", {
                    state: { prompt: prompt, comp_id: comp_id },
                  })
                }
              >
                Draw
              </Button>
            )}
          </h1>
        </div>
        <div className="filter-options">
          <ul className="filter-list">
            <li className="filter">
              <b>Filter by:</b>
            </li>
            <li
              className="filter-item reg-hover"
              onClick={() => callSorter("random")}
            >
              Random
            </li>
            <li
              className="filter-item reg-hover"
              onClick={() => callSorter("likes-ascend")}
            >
              Least Liked
            </li>
            <li
              className="filter-item reg-hover"
              onClick={() => callSorter("likes-descend")}
            >
              Most Liked
            </li>
            <li
              className="filter-item reg-hover"
              onClick={() => callSorter("date-descend")}
            >
              Newest
            </li>
            <li
              className="filter-item reg-hover"
              onClick={() => callSorter("date-ascend")}
            >
              Oldest
            </li>
          </ul>
        </div>
      </div>
      <div className="gal">
        {images.length === 0 ? (
          <h1>No images yet!</h1>
        ) : (
          <Row xs={6} className="g-4">
            {images.map((val, idx) => (
              <Col key={idx}>
                <Card>
                  <Card.Img variant="top" src={val["s3_url"]}  className="gallery-img" onClick={() => handleImageClick(val["s3_url"], val["username"], val["date_created"], val["drawing_id"])}/>
                  <Card.Body id="card">
                    <div className="user_info">
                      <img src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG" width={60}/>
                      <p className="name">{val["username"]}</p>
                    </div>
                    <div className="like-container">
                      {user_likes.includes(val["drawing_id"]) ? (
                        <button
                          className="like"
                          onClick={() => handleLikes(val["drawing_id"])}
                        >
                          <i className="fa-solid fa-heart fa-2xs"></i>
                        </button>
                      ) : (
                        <button
                          className="like"
                          onClick={() => handleLikes(val["drawing_id"])}
                        >
                          <i className="fa-regular fa-heart fa-2xs"></i>
                        </button>
                      )}
                      <div className="like-counter">{val["likes"]}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
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
          liked={user_likes.includes(selectedImageDrawingID)}
        />
      )} 
    </>
  );
}

export default GalleryPage;
