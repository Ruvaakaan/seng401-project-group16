import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { getImages } from "./getImages.js";

function GalleryPage() {
  const [user_likes, setUserLikes] = useState([1, 3]); // array of all posts liked by user
  const [images, setImages] = useState([]);
  const [userEnter, setUserEnter] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const prompt = location.state?.prompt;
  const comp_id = location.state?.comp_id;

  var title = "Gallery"

  useEffect(()=> {
    if (prompt){ 
        title = prompt;
        setUserEnter(true);
      }
      handleImages(comp_id);
    
  }, [])

  function like_change(val) {
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
    if (res.ok){
      console.log("success")
    }
  }

  const handleImages = async (id) => {
    
    let image_list = await getImages(id);

    if (!image_list){
      setImages(images => [...images, []]); // change how this is handled here
      return;
    }
    setImages(images => [...images, image_list]);
  };

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
    setImages(extracted);
  };

  return (
    <>
    <div className="gallery-banner">
      <h1 className="gallery-title">{title}</h1>
      {userEnter && (
      <Button
                  variant="outline-dark"
                  className="entry-button"
                  onClick={() =>
                    nav("/draw", {
                      state: { prompt: prompt, comp_id: comp_id },
                    })
                  }
                ></Button>

      )}
      <div className="filter-options">
        <ul className="filter-list">
          <li className="filter">
            <b>Filter:</b>
          </li>
          <li className="filter-item reg-hover" onClick={()=>callSorter("hot")}>Hot</li>
          <li className="filter-item reg-hover"onClick={()=>callSorter("pop")}>Popular</li>
          <li className="filter-item reg-hover"onClick={()=>callSorter("new")}>Newest</li>
        </ul>
      </div>
    </div>
      <div className="gal">
        <Row xs={6} className="g-4">
          {images.map((val, idx) => (
            <Col key={idx}>
              <Card>
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
    </>
  );
}

export default GalleryPage;
