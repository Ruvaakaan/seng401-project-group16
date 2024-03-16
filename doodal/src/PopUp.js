import React, { useState, useEffect } from "react";
import { Modal, Image } from "react-bootstrap";
import "./PopUp.css";
import CommentsSidebar from "./CommentsSidebar";
import { getComments } from "./GetComments";

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
  const [comments, setComments] = useState([]);

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  // get the comments here
  const handleComments = async () => {
    var body = await getComments(drawingID);

    console.log(body);
  };

  // useEffect(() => {
  //   handleComments();
  // }, []);

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
