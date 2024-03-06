import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import './Popup.css';

const Popup = ({ show, handleClose, selectedImage, username }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-lg">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          {selectedImage && (
            <img
              // src={selectedImage}
              src="octopus.PNG" // temp image src. set it to {selectedImage} 
              alt="Popup image"
              className="popup-image"
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="popup-footer">
        <div className="user_info">
          <img className="logo" src="octopus.PNG" alt="Logo" />
          {/* <span className="name">{username}</span> */}
          <span className="name">Username</span> 
        </div>
        <div className="like-btn" onClick={handleLike} >
          {liked ? (
                  <button className="like">
                    &#9829;
                  </button>
                ) : (
                  <button className="like">
                    &#9825;
                  </button>
                )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
