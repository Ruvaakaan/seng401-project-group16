import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([1, 3]); // array of all posts liked by user
  const [posts, setPosts] = useState([]);
  var tmp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // temporary array

  function like_change(val) {
    if (user_likes.includes(val)) {
      setUserLikes(user_likes.filter((item) => item !== val));
      return;
    }
    setUserLikes([...user_likes, val]);
  }

  return (
    <>
      <h1>Gallery</h1>
      <div className="filter-options">
        <ul className="filter-list">
          <li className="filter">
            <b>Filter:</b>
          </li>
          <li className="filter-item">Hot</li>
          <li className="filter-item">Popular</li>
          <li className="filter-item">Newest</li>
        </ul>
      </div>
      <div className="gal">
        <Row xs={6} className="g-4">
          {tmp.map((val, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Img variant="top" src="doodal.PNG" />
                <Card.Body id="card">
                  <div className="user_info">
                    <img src="octopus.PNG" width={60} />
                    <text>Username{val}</text>
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
    </>
  );
}

export default GalleryPage;
