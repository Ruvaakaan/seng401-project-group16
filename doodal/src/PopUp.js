import React, { useState, useEffect } from "react";
import { Modal, Image } from "react-bootstrap";
import "./PopUp.css";
import CommentsSidebar from "./CommentsSidebar";

const Popup = ({
  show,
  handleClose,
  selectedImage,
  username,
  prompt,
  dateCreated,
  drawingID,
  liked,
}) => {

  return (
    <Modal
      show={show}
      onHide={() => handleClose(false)}
      dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>{prompt}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup-modal">
        <div className="popup-content">
          <div className="image-section">
            {selectedImage && (
              <Image
                src={selectedImage}
                fluid
                rounded
                style={{ border: "2px solid black" }}
              />
            )}
          </div>
          <div className="comments">
            <CommentsSidebar
              drawingID={drawingID}
              username={username}
              likes={liked}
              dateCreated={dateCreated}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Popup;
