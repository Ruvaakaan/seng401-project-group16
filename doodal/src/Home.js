import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";
import { getImages } from "./getImages.js";

function Home() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const nav = useNavigate();

  const [comps, setComps] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]);

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
      await handleImages(body[i]["competition_id"]["S"]);
      newPrompts.push(body[i]["prompt"]["S"]);
    }
    setComps(newComps);
    setPrompts(newPrompts);
  };

  const handleImages = async (id) => {
    
    let image_list = await getImages(id);

    if (!image_list){
      setImages(images => [...images, []]);
      return;
    }
    setImages(images => [...images, image_list]);
  };

  useEffect(() => {
    getPrompts();
  }, []);

  // useEffect(()=> {
  //   console.log(images);
  // }, [images])

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
                <h1 className="prompt-title">
                  Ongoing Competition: {prompts[index]}
                </h1>
                <Button
                  variant="outline-dark"
                  className="entry-button"
                  onClick={() =>
                    nav("/gallery", {
                      state: { prompt: prompts[index], comp_id: comps[index] },
                    })
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
              {images[index]?.length === 0 ? (
                <h1>No images yet!</h1>
              ) : (
                images[index].map((item, index) => (
                  <SwiperSlide key={index}>
                    <img src={item} width={550} className="home-imgs" />
                  </SwiperSlide>
                ))
              )}
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
