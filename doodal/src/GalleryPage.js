import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { getImages } from "./getImages.js";
import { sortImages } from "./sortDrawings.js";

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([1, 3]); // array of all posts liked by user
  const [images, setImages] = useState([]);
  const [userEnter, setUserEnter] = useState(false);
  const [title, setTitle] = useState("Gallery");

  const nav = useNavigate();
  const location = useLocation();
  const prompt = location.state?.prompt;
  const comp_id = location.state?.comp_id;

  useEffect(() => {
    if (prompt) {
      setTitle(prompt);
      setUserEnter(true);
      handleImages(comp_id);
    } else {
      callSorter("likes-descend");
    }
  }, []);

  function like_change(val) { // this function changes the heart icon for liking and unliking
    if (user_likes.includes(val)) {
      setUserLikes(user_likes.filter((item) => item !== val));
      return;
    }
    setUserLikes([...user_likes, val]);
  }

  const handleLikes = async () => {
    let res = await fetch(
      `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_drawings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "tmp", // need to find a way to get user id
          drawing_id: "tmp", // need to get drawing id
        }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  };

  const handleImages = async (id) => {
    let body = await getImages(id);

    let post_info_list = []; // tragedy isnt it?
    let post_info = {};
    try {
      for (let i = 0; i < body["items"].length; i++) {
        post_info['s3_url'] = body["items"][i]["s3_url"]["S"];
        post_info['competition_id'] = body["items"][i]["competition_id"]["S"];
        post_info['drawing_id'] = body["items"][i]["drawing_id"]["S"];
        post_info['likes'] = body["items"][i]["likes"]["N"];
        post_info['user_id'] = body["items"][i]["user_id"]["S"];
        post_info['date_created'] = body["items"][i]["date_created"]["S"];
        post_info_list.push(post_info);
      }
    } catch {
    }

    if (!post_info_list) {
      return;
    }
    setImages(post_info_list);
  };

  const callSorter = async (s) => {
    let body = await sortImages(s);
    if (!body) {
      return;
    }
    setImages(body);
  };

  useEffect(() => {
    console.log("images:", images);
  }, [images]);

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
        <Row xs={6} className="g-4">
          {images.map((val, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Img variant="top" src={val['s3_url']} />
                <Card.Body id="card">
                  <div className="user_info">
                    <img src="octopus.PNG" width={60} />
                    <text className="name">{val['user_id']}</text>
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
