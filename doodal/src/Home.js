import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";

function Home() {
  var prompt = "new";
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const nav = useNavigate();

  const [current, setCurrent] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [comps, setComps] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const getPrompts = async () => {
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
    let newComps = [];
    let newPrompts = [];
    for (let i = 0; i < 3; i++) {
      // take 3 most recent prompts
      newComps.push(body[i]["competition_id"]["S"]);
      newPrompts.push(body[i]["prompt"]["S"]);
    }
    setComps(newComps);
    setPrompts(newPrompts);
    // getImages();
  };

  const getImages = async () => {
    // 2 requests to get each set? (previous prompt images and current prompt images)

    // let res = await fetch(``, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // let extracted = await res.json();
    // setCurrent(extracted);
    console.log("get imgs");
  };

  useEffect(() => {
    getPrompts();
  }, []);

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
      {comps !== null ? (
        comps.map((item, index) => (
          <>
            <div className="prompt-display">
              <div className="prompt-button">
                <h1 className="prompt-title">Current Competition: {prompts[index]}</h1>
                <Button
                  variant="outline-dark"
                  className="entry-button"
                  onClick={() =>
                    nav("/gallery", { state: { additionalProp: prompts[index] } })
                  }
                >
                  View
                </Button>
              </div>
            </div>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={4}
              pagination={{ clickable: true }}
              navigation
            >
              {current.map((item, index) => (
                <SwiperSlide key={index}>
                  <img src="octopus.PNG" width={550} className="home-imgs" />
                </SwiperSlide> // temp image, item should hold the image so use {item}
              ))}
            </Swiper>
          </>
        ))
      ) : (
        <></>
      )}
    </>
  );
}

export default Home;
