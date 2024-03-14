import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";
import { sortImages } from "./sortDrawings.js";

function Home() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const nav = useNavigate();

  const [prompts, setPrompts] = useState([]); // array of prompts
  const [images, setImages] = useState([]); // array of images

  const getPrompts = async () => { // fetches the prompts from the prompts table
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
    let { body } = extracted;
    let newPrompts = [];

    var len = body.length < 5 ? body.length : 5; // len decides how many prompts to pull, if we have less than 5 prompts, we get all, otherwise 5 at most

    for (let i = 0; i < len; i++) {
      await handleImages(body[i]["competition_id"]["S"]); // call handle image to get the top image for that prompt
      newPrompts.push(body[i]["prompt"]["S"]); // add prompt to the prompts list
    }
    setPrompts(newPrompts);
  };

  const handleImages = async (id) => {
    let body = await sortImages("likes-descend", id, 1); // uses the sort api call to get the most liked post for the given competition

    if (!body[0]) { // if there are no photos for the competition we have an empty item added
      setImages((images) => [...images, []]);
      return;
    }

    setImages((images) => [...images, body[0]]); // adds the top photo to the list
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
        className="banner"
      ></img>
      <h1 className="memo-banner">
        Welcome to DOODAL! Participate in daily art challenges and share your
        art with others!
      </h1>
      <div className="prompt-display">
        <div className="prompt-button">
          <h1 className="prompt-title">Ongoing Competitions</h1>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation
      >
        {images.length === 0 ? (
          <SwiperSlide>
            <h1>No images yet!</h1>
          </SwiperSlide>
        ) : (
          images.map((val, idx) => (
            <SwiperSlide key={idx}>
              <h1>{prompts[idx]}</h1>
              <img
                src={
                  images[idx]["s3_url"] ? images[idx]["s3_url"] : "octopus.PNG" 
                } 
                width={550}
                className="home-imgs"
                onClick={() =>
                  nav("/gallery", {
                    state: {
                      prompt: prompts[idx],
                      comp_id: images[idx]["competition_id"],
                    },
                  })
                }
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </>
  );
}

export default Home;
