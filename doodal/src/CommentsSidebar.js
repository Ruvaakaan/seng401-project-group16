import React, { useState, useEffect } from "react";
import "./CommentsSidebar.css";
import { Toast, Image, Form, Button } from "react-bootstrap";
import { addComments } from "./AddComments";

const CommentsSidebar = ({
  drawingID,
  username,
  likes,
  comments,
  dateCreated,
}) => {
  const [newComment, setNewComment] = useState("");
  const [timeDifference, setTimeDifference] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = async (comment) => {
    let body = await addComments(drawingID, comment);
    console.log("comment response", body);

    setNewComment("");
  };

  useEffect(() => {
    console.log("date created", dateCreated);
    const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
    const dateCreatedSeconds = dateCreated;
    const timeDifferenceSeconds = currentDateSeconds - dateCreatedSeconds;

    if (timeDifferenceSeconds < 60) {
      setTimeDifference(`${timeDifferenceSeconds} seconds ago`);
    } else if (timeDifferenceSeconds < 60 * 60) {
      const minutes = Math.floor(timeDifferenceSeconds / 60);
      setTimeDifference(`${minutes} minutes ago`);
    } else if (timeDifferenceSeconds < 60 * 60 * 24) {
      const hours = Math.floor(timeDifferenceSeconds / (60 * 60));
      setTimeDifference(`${hours} hours ago`);
    } else {
      const days = Math.floor(timeDifferenceSeconds / (60 * 60 * 24));
      setTimeDifference(`${days} days ago`);
    }
  }, [dateCreated]);

  return (
    <div className="comments-sidebar">
      <div className="top-section">
        <div className="profile-photo">
          <Image
            src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
            roundedCircle
            className="profile-photo"
          />
        </div>
        <div className="post-info">
          <span className="username">By: {username}</span>
          <span className="posted-time">Posted: {timeDifference}</span>
        </div>
        <i className="fa-regular fa-heart fa-2xl" style={{ color: "red" }}></i>
      </div>

      <h3>Comments: </h3>
      <Form className="post-comment-form">
        <Form.Group controlId="newComment">
          <Form.Control
            type="text"
            placeholder="Press enter to post comment"
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePostComment(newComment);
              }
            }}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
        >
          Post
        </Button>
      </Form>

      <div className="comments-section">
        {comments.map((comment, index) => (
          <Toast key={index} className="custom-toast">
            <Toast.Header closeButton={false}>
              <Image
                src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
                roundedCircle
                className="profile-photo"
              />
              <strong className="me-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>{comment}</Toast.Body>
          </Toast>
        ))}
      </div>
    </div>
  );
};

export default CommentsSidebar;
