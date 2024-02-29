import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Popup from "./Popup"
import { useLocation } from 'react-router-dom';

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([1, 3]); // array of all posts liked by user
  const [posts, setPosts] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const location = useLocation();
  const prompt = location.state?.additionalProp;

  function like_change(val) {
    if (user_likes.includes(val)) {
      setUserLikes(user_likes.filter((item) => item !== val));
      return;
    }
    setUserLikes([...user_likes, val]);
  }

  const callSorter = async (s) => {
    // const link = "hello/"+s;
    // console.log(link);
    // const res = await fetch(
    //   ``,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const extracted = await res.json();

    let v = Math.floor(Math.random() * 10);
    let extracted = new Array(v).fill(1);
    setPosts(extracted);
  };

  // For the Popup //
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  return (
    <>
    <div className="gallery-banner">
      <h1 className="gallery-title">Gallery {prompt}</h1>
      <div className="filter-options">
        <ul className="filter-list">
          <li className="filter">
            <b>Filter:</b>
          </li>
          <li className="filter-item" onClick={()=>callSorter("hot")}>Hot</li>
          <li className="filter-item"onClick={()=>callSorter("pop")}>Popular</li>
          <li className="filter-item"onClick={()=>callSorter("new")}>Newest</li>
        </ul>
      </div>
    </div>
      <div className="gal">
        <Row xs={6} className="g-4">
          {posts.map((val, idx) => (
            <Col key={idx}>
              <Card onClick={() => handleImageClick(val)}>
                <Card.Img variant="top" src="doodalnew.PNG" />
                <Card.Body id="card">
                  <div className="user_info">
                    <img src="octopus.PNG" width={60} />
                    <text className="name">Username{val}</text>
                  </div>
                  {user_likes.includes(val) ? (
                    <button className="like" onClick={() => like_change(val)}>
                      &#9829;
                    </button>
                  ) : (
                    <button className="like" onClick={() => like_change(val)}>
                      &#9825;
                    </button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Popup 
      show={showModal}
      handleClose={handleCloseModal}
      selectedImage={selectedImage}
      username="username1"
      />
    </>
  );
}

export default GalleryPage;
