import React from "react";
import { Modal } from "react-bootstrap";

const Popup = ({ show, handleClose, selectedImage }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Image Popup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedImage && (
          <img src={selectedImage} alt="Popup" style={{ width: "100%" }} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Popup;
