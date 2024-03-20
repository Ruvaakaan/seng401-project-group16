import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Draw from "./DrawPage";
import Account from "./Account";
import Gallery from "./GalleryPage";
import ViewAccount from "./ViewAccount";
import NotFound from "./NotFound";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="draw" element={<Draw />} />
        <Route path="profile" element={<Account />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="gallery/:version" element={<Gallery />} />
        <Route path="viewaccount" element={<ViewAccount />}>
          <Route path=":username" element={<ViewAccount />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

reportWebVitals();
