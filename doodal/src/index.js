import React from 'react';
import App from './App';
import Home from './Home';
import Comp from './Comp';
import Draw from './DrawPage';
import Account from './Account';
import Gallery from './GalleryPage';
import reportWebVitals from './reportWebVitals';
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/competition",element: <Comp />,},
      { path: "/draw", element: <Draw /> },
      { path: "/profile", element: <Account/> },
      { path: "/gallery", element: <Gallery/> }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
