import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";
import { sortImages } from "./sortDrawings.js";
import { Row, Col, Card } from "react-bootstrap";

function Home() {
  const { isDarkMode } = useDarkMode();
  const nav = useNavigate();

  const [currentPrompts, setCurrentPrompts] = useState([]); // array of prompts
  const [oldPrompts, setOldPrompts] = useState([]);
  const [images, setImages] = useState([]); // array of images
  const [oldImages, setOldImages] = useState([]);

  // const [showModal, setShowModal] = useState(false);

  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };

  const convertTime = (dateCreated) => {
    const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
    const timeDifferenceSeconds = currentDateSeconds - dateCreated;

    if (timeDifferenceSeconds < 60) {
      return timeDifferenceSeconds === 1
        ? "1 second ago"
        : `${timeDifferenceSeconds} seconds ago`;
    } else if (timeDifferenceSeconds < 60 * 60) {
      const minutes = Math.floor(timeDifferenceSeconds / 60);
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else if (timeDifferenceSeconds < 60 * 60 * 24) {
      const hours = Math.floor(timeDifferenceSeconds / (60 * 60));
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else {
      const days = Math.floor(timeDifferenceSeconds / (60 * 60 * 24));
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
  };

  const getBorderColor = (difficulty) => {
    switch (difficulty) {
      case "hard":
        return "danger";
      case "medium":
        return "warning";
      case "easy":
        return "success";
      default:
        return "dark";
    }
  };
  const getPrompts = async () => {
    // fetches the prompts from the prompts table
    let res = await fetch(
      `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_prompts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let extracted = await res.json();
    let body = extracted["body"];
    let new_prompts = body["new_prompts"];
    let old_prompts = body["old_prompts"];

    var len = new_prompts.length < 5 ? new_prompts.length : 5; // len decides how many prompts to pull, if we have less than 5 prompts, we get all, otherwise 5 at most
    var newCompetitions = [];

    for (let i = 0; i < len; i++) {
      let newPrompts = {};
      newPrompts["prompt"] = new_prompts[i]["prompt"]["S"];
      newPrompts["comp_id"] = new_prompts[i]["competition_id"]["S"];
      newPrompts["difficulty"] = new_prompts[i]["difficulty"]["S"];
      newPrompts["date_created"] = new_prompts[i]["date_created"]["S"];
      newCompetitions.push(newPrompts); // add prompt to the prompts list
      await handleImages(new_prompts[i]["competition_id"]["S"], "new"); // call handle image to get the top image for that prompt
    }

    var oldCompetitions = [];
    for (let i = 0; i < old_prompts.length; i++) {
      let oldPrompt = {};
      oldPrompt["prompt"] = old_prompts[i]["prompt"]["S"];
      oldPrompt["comp_id"] = old_prompts[i]["competition_id"]["S"];
      oldPrompt["difficulty"] = old_prompts[i]["difficulty"]["S"];
      oldPrompt["date_created"] = old_prompts[i]["date_created"]["S"];
      oldCompetitions.push(oldPrompt); // add prompt to the prompts list
      await handleImages(old_prompts[i]["competition_id"]["S"], "old"); // call handle image to get the top image for that prompt
    }

    setCurrentPrompts(newCompetitions);
    setOldPrompts(oldCompetitions);
  };

  const handleImages = async (id, version) => {
    let body = await sortImages("likes-descend", id, 1); // uses the sort api call to get the most liked post for the given competition
    // console.log("ID:", id);
    // console.log("Version:", version);
    // console.log("Body:", body);
    if (!body[0]) {
      // if there are no photos for the competition
      if (version === "new") {
        setImages((images) => [...images, []]); // add an empty item for new prompts
      } else if (version === "old") {
        setOldImages((oldImages) => [...oldImages, []]); // add an empty item for old prompts
      }
      return;
    }

    if (version === "new") {
      setImages((images) => [...images, body[0]]); // adds the top photo to the list for new prompts
    } else if (version === "old") {
      setOldImages((oldImages) => [...oldImages, body[0]]); // adds the top photo to the list for old prompts
    }
  };

  useEffect(() => {
    getPrompts(); // when page is first loaded, we get the images/prompts
  }, []);

  // useEffect(() => {
  //   console.log(images); // debugging for images
  // }, [images]);

  return (
    <>
      <img
        src={isDarkMode ? "blurbannerdark.png" : "blurbanner.png"}
        className="banner" alt="banner"
      ></img>
      <h1 className="memo-banner">
        Welcome to DOODAL! Participate in daily art challenges and share your
        art with others!
      </h1>
      <div className="prompt-display">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1
            className="prompt-title"
            style={{ margin: 0, textAlign: "center", flex: 1 }}
          >
            Current Competitions
          </h1>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={4}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation
        style={{ margin: "10px" }}
      >
        {images.length === 0 ? (
          <h1>No images yet!</h1>
        ) : (
          currentPrompts.map((val, idx) => (
            <SwiperSlide className="swiper-slide-container" key={idx}>
              <Card
                className="swiper-card"
                border={getBorderColor(currentPrompts[idx]?.difficulty)}
              >
                <Card.Header style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {currentPrompts[idx] && (
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "2em",
                        margin: 0,
                      }}
                    >
                      {currentPrompts[idx]["prompt"]}
                    </p>
                  )}
                </Card.Header>
                <Card.Img
                  variant="flush"
                  src={
                    images[idx]["s3_url"]
                      ? images[idx]["s3_url"]
                      : "empty_comp.png"
                  }
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    nav(`/gallery/${currentPrompts[idx]["comp_id"]}`, {
                      state: {
                        prompt: currentPrompts[idx]["prompt"],
                        comp_id: currentPrompts[idx]["comp_id"],
                      },
                    })
                  }
                />
                <Card.Footer>
                  {currentPrompts[idx] && (
                    <p style={{
                      fontWeight: "bold",
                      fontSize: "1.2em",
                      margin: 0,
                    }}>
                      Posted {convertTime(currentPrompts[idx]["date_created"])}
                    </p>
                  )}
                </Card.Footer>
              </Card>
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Competition Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>Competition</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

      <div className="prompt-display">
        <div className="prompt-button">
          <h1 className="prompt-title">Previous Competitions</h1>
        </div>
      </div>

      <div className="old-prompts" style={{ margin: "10px" }}>
        {oldImages.length === 0 ? (
          <h1>No old competitions yet!</h1>
        ) : (
          <Row xs={4} className="g-4">
            {oldImages.map((val, idx) => (
              <Col key={idx}>
                <Card border={getBorderColor(oldPrompts[idx]?.difficulty)}>
                <Card.Header style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {oldPrompts[idx] && (
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "2em",
                        margin: 0,
                      }}
                    >
                      {oldPrompts[idx]["prompt"]}
                    </p>
                  )}
                </Card.Header>
                  <Card.Img
                    variant="top"
                    src={val["s3_url"]}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      nav(`/gallery/${oldPrompts[idx]["comp_id"]}`, {
                        state: {
                          prompt: oldPrompts[idx]["prompt"],
                          comp_id: oldPrompts[idx]["comp_id"],
                        },
                      })
                    }
                  />

                  <Card.Footer>
                    {oldPrompts[idx] && (
                      <p style={{
                        fontWeight: "bold",
                        fontSize: "1.2em",
                        margin: 0,
                      }}>
                        Posted {convertTime(oldPrompts[idx]["date_created"])}
                      </p>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default Home;
