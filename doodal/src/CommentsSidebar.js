import React, { useState, useEffect } from "react";
import "./CommentsSidebar.css";
import { Toast, Image, Form, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import { addComments } from "./AddComments";
import { likeUnlike } from "./LikeAndUnlike.js";

const CommentsSidebar = ({
  drawingID,
  username,
  likes,
  comments,
  dateCreated,
}) => {
  const [postComments, setPostComments] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [timeDifference, setTimeDifference] = useState("");
  const [liked, setLiked] = useState(likes);
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleLike = async () => {
    await likeUnlike(drawingID);
    setLiked(!liked);
  };

  const handlePostComment = async () => {
    if (newComment.trim()) {
      let body = await addComments(drawingID, newComment);
      setPostComments([newComment, ...postComments]);
      setNewComment("");
    }
  };

  useEffect(() => {
    const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
    const timeDifferenceSeconds = currentDateSeconds - dateCreated;

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
        {liked ? (
          <button className="like" onClick={() => handleLike(drawingID)}>
            <i className="fa-solid fa-heart fa-2xs"></i>
          </button>
        ) : (
          <button className="like" onClick={() => handleLike(drawingID)}>
            <i className="fa-regular fa-heart fa-2xs"></i>
          </button>
        )}
      </div>

      <h3>Comments: </h3>
      <Form className="post-comment-form" onSubmit={(e) => e.preventDefault()}>
        <Form.Group controlId="newComment">
          <Form.Control
            type="text"
            placeholder="Press enter to post comment"
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePostComment();
              }
            }}
          />
        </Form.Group>
        <Button
          variant="outline-dark"
          onClick={handlePostComment}
          disabled={!newComment.trim() || !Cookies.get("userInfo")}
        >
          Post
        </Button>
      </Form>

      <div className="comments-section">
        {postComments.map((comment, index) => (
          <Toast key={index} className="custom-toast">
            <Toast.Header closeButton={false} className="custom-toast-header">
              <Image
                src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
                roundedCircle
                className="profile-photo"
              />
              <strong className="me-auto">{username}</strong>
              <small>{timeDifference}</small>
            </Toast.Header>
            <Toast.Body>{comment}</Toast.Body>
          </Toast>
        ))}
      </div>
    </div>
  );
};

export default CommentsSidebar;
