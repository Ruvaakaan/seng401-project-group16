import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  var prompt = "new";
  var oldprompt = "old";

  const [current, setCurrent] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [pastComp, setPastComp] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const nav = useNavigate();
  return (
    <>
      <div className="prompt-display">
        <img src="blurbanner.png" className="banner"></img>
        <h1 className="memo-banner">
          Welcome to DOODAL! Participate in daily art challenges and share your
          art with others!
        </h1>
        <div className="prompt-button">
          <h1 className="prompt-title">Current Competition: {prompt}</h1>
          <Button
            variant="outline-dark"
            className="entry-button"
            onClick={() =>
              nav("/competition", { state: { additionalProp: prompt } })
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
            <img src="octopus.PNG" width={550} className="home-imgs"/>
          </SwiperSlide> // temp image, item should hold the image so use {item}
        ))}
      </Swiper>
      <div className="prompt-display">
        <div className="prev-prompt">
          <h1 className="prompt-title">Previous Competition: {oldprompt}</h1>
          <Button
            variant="outline-dark"
            className="entry-button"
            onClick={() =>
              nav("/gallery", { state: { additionalProp: oldprompt } })
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
        {pastComp.map((item, index) => (
          <SwiperSlide key={index}>
            <img src="doodalnew.PNG" width={550} className="home-imgs"/>
          </SwiperSlide> // temp image, item should hold the image so use {item}
        ))}
      </Swiper>
    </>
  );
}

export default Home;
