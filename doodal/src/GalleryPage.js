import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { getImages } from "./getImages.js";
import { sortImages } from "./sortDrawings.js";
import { likeUnlike } from "./LikeAndUnlike.js";

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([]); // array of all posts liked by user
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

  useEffect(() => {
    console.log(user_likes);
  }, [user_likes]);

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

  const handleImages = async (id) => {
    let body = await getImages(id);
    let post_info_list = []; // tragedy isnt it?
    let userLikesList = [];
    try {
      for (let i = 0; i < body.length; i++) {
        let post_info = {};
        post_info["s3_url"] = body[i]["s3_url"]["S"];
        post_info["competition_id"] = body[i]["competition_id"]["S"];
        post_info["drawing_id"] = body[i]["drawing_id"]["S"];
        post_info["likes"] = body[i]["likes"]["N"];
        post_info["user_id"] = body[i]["user_id"]["S"];
        post_info["date_created"] = body[i]["date_created"]["S"];
        post_info_list.push(post_info);

        if (body[i]["liked_by_user"]) {
          userLikesList.push(body[i]["drawing_id"]["S"]);
        }
      }
    } catch {}

    if (!post_info_list) {
      return;
    }
    setImages(post_info_list);
    setUserLikes(userLikesList);
  };

  const callSorter = async (s) => {
    var i = "";
    if (comp_id) {
      i = comp_id;
    }
    let body = await sortImages(s, i, -1);
    if (!body) {
      return;
    }
    setImages(body);
  };

  // useEffect(() => {
  //   console.log("images:", images);
  // }, [images]);

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
                  <Card.Img variant="top" src={val["s3_url"]} />
                  <Card.Body id="card">
                    <div className="user_info">
                      <img src="octopus.PNG" width={60} />
                      <text className="name">{val["user_id"]}</text>
                    </div>
                    <div className="like-counter">{val["likes"]} Likes</div>
                    {user_likes.includes(val["drawing_id"]) ? (
                      <button
                        className="like"
                        onClick={() => handleLikes(val["drawing_id"])}
                      >
                        &#9829;
                      </button>
                    ) : (
                      <button
                        className="like"
                        onClick={() => handleLikes(val["drawing_id"])}
                      >
                        &#9825;
                      </button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default GalleryPage;
