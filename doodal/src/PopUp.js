import React, { useState, useEffect } from "react";
import { Modal, Image } from "react-bootstrap";
import './PopUp.css';
import CommentsSidebar from "./CommentsSidebar";

const Popup = ({ show, handleClose, selectedImage, username, prompt, dateCreated }) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([
    "Great work!",
    "Love it!",
    "Awesome job!",
    "YEYEYEYEYYE",
    "YEYEYEYEYYE",
    "YEYEYEYEYYE",
    "YEYEYEYEYYE",
  ]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  // useEffect(() => {
  //   if (selectedImage) {
  //     console.log("Selected Image:", selectedImage);
  //   }
  // }, [selectedImage]);

  return (
    <Modal
        show={show}
        onHide={() => handleClose(false)}
        dialogClassName="modal-90w"
      >
      <Modal.Header closeButton>
        <Modal.Title>{prompt}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup-modal">
        <div className="popup-content">
          <div className="image-section">
            {selectedImage && (
              <Image src={selectedImage} fluid rounded style={{ border: "2px solid black" }}/>
            )}
          </div>
          <div className="comments">
            <CommentsSidebar
              username={username}
              likes={liked ? 1 : 0}
              comments={comments}
              dateCreated={dateCreated}
            />
          </div>
        </div>
      </Modal.Body>
      
    </Modal>
  );
};

export default Popup;
