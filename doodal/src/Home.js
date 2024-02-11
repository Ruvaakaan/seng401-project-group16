import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';

function Home() {
  var prompt = "new";
  var oldprompt = "old";

  var curr_prompt = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // replace with actual images after api
  var old_prompt = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // replace with actual images after api

  const nav = useNavigate();
  return (
    <>
      <div className="prompt-display">
        <h1 className="prompt-title">
          Previous Competition Entries: {prompt}
        </h1>
        <Button
          variant="outline-dark"
          className="entry-button"
          onClick={() => nav("/competition")}
        >
          Join!
        </Button>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={3}
        pagination={{ clickable: true }}
        navigation
      >
        {curr_prompt.map((item, index) => (
          <SwiperSlide key={index}>
            <img src="octopus.PNG" width={600} />
          </SwiperSlide> // temp image, item should hold the image so use {item}
        ))}
      </Swiper>
      <div className="prompt-display">
        <h1 className="prompt-title">
          Previous Competition Entries: {oldprompt}
        </h1>
        <Button
          variant="outline-dark"
          className="entry-button"
          onClick={() => nav("/gallery")}
        >
          View
        </Button>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={3}
        pagination={{ clickable: true }}
        navigation
      >
        {old_prompt.map((item, index) => (
          <SwiperSlide key={index}>
            <img src="doodal.PNG" width={600} />
          </SwiperSlide> // temp image, item should hold the image so use {item}
        ))}
      </Swiper>
    </>
  );
}

export default Home;
