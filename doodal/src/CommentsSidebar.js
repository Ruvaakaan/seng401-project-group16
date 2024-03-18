import React, { useState, useEffect } from "react";
import "./CommentsSidebar.css";
import { Toast, Image, Form, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import { addComments } from "./AddComments";
import { likeUnlike } from "./LikeAndUnlike.js";
import { getComments } from "./GetComments.js";
import { delComments } from "./DeleteComment.js";
import { timeConverter } from "./TimeConverter.js";

const CommentsSidebar = ({ drawingID, username, likes, dateCreated }) => {
  const [postComments, setPostComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [timeDifference, setTimeDifference] = useState("");
  const [liked, setLiked] = useState(likes);
  const loggedUser = Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))["username"]["S"]
    : null;

  const handleCommentChange = (event) => {
    if (!Cookies.get("userInfo")) {
      setNewComment("You were logged out. Please log in and try again.");
    } else {
      setNewComment(event.target.value);
    }
  };

  const handleLike = async () => {
    await likeUnlike(drawingID);
    setLiked(!liked);
  };

  const handlePostComment = async () => {
    if (newComment.trim()) {
      await addComments(drawingID, newComment);
      var newCommentAdded = {};
      newCommentAdded["user"] = JSON.parse(Cookies.get("userInfo"))["username"][
        "S"
      ];
      newCommentAdded["text"] = newComment;
      newCommentAdded["date"] = Math.floor(new Date().getTime() / 1000);
      setPostComments([newCommentAdded, ...postComments]);
      setNewComment("");
    }
  };

  // get the comments here
  const handleComments = async () => {
    var body = await getComments(drawingID);
    var toAdd = [];
    for (let i = 0; i < body.length; i++) {
      var commentToAdd = {};
      commentToAdd["text"] = body[i]["comment_text"]["S"];
      commentToAdd["user"] = body[i]["username"]["S"];
      commentToAdd["date"] = body[i]["date_created"]["S"];
      toAdd.push(commentToAdd);
    }
    toAdd.reverse();
    setPostComments(toAdd);
  };

  const handleDeleteComment = async (dc, i) => {
    await delComments(drawingID, dc);
    var newArray = [...postComments];
    newArray.splice(i, 1);
    setPostComments(newArray);
  };

  useEffect(() => {
    setTimeDifference(timeConverter(dateCreated));
  }, [dateCreated]);

  useEffect(() => {
    handleComments();
  }, []);

  return (
    <div className="comments-sidebar">
      <div className="top-section">
        <div className="user-post-info">
          <div>
            <Image
              src="https://doodals-bucket-seng401.s3.us-west-2.amazonaws.com/website+photos/octopus.PNG"
              roundedCircle
              className="profile-photo"
            />
          </div>
          <div className="post-info">
            <span className="username" style={{ textTransform: "capitalize" }}>
              By: {username}
            </span>
            <span className="posted-time">Posted: {timeDifference}</span>
          </div>
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

      <p className="comments-title">Comments: </p>
      <Form className="post-comment-form" onSubmit={(e) => e.preventDefault()}>
        <Form.Group controlId="newComment" className="enter-comment-box">
          <Form.Control
            type="text"
            placeholder={
              Cookies.get("userInfo")
                ? "Type your comment here"
                : "You must be logged in to comment"
            }
            value={newComment}
            onChange={handleCommentChange}
            disabled={!Cookies.get("userInfo")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && Cookies.get("userInfo")) {
                e.preventDefault();
                handlePostComment();
              }
            }}
          />
        </Form.Group>
        {!Cookies.get("userInfo") ? (
          <></>
        ) : (
          <Button
            className="post-comment-button"
            variant="outline-dark"
            onClick={handlePostComment}
            disabled={!newComment.trim() || !Cookies.get("userInfo")}
          >
            Post
          </Button>
        )}
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
              <strong
                className="me-auto comment-user"
                style={{ textTransform: "capitalize" }}
              >
                {postComments[index]["user"]}
              </strong>
              <small>{timeConverter(postComments[index]["date"])}</small>

              {postComments[index]["user"] === loggedUser ? (
                <i
                  className="fa-solid fa-trash comment-action-icon"
                  onClick={() =>
                    handleDeleteComment(postComments[index]["date"], index)
                  }
                ></i>
              ) : (
                <i className="fa-solid fa-flag comment-action-icon"></i>
              )}
            </Toast.Header>
            <Toast.Body>{postComments[index]["text"]}</Toast.Body>
          </Toast>
        ))}
      </div>
    </div>
  );
};

export default CommentsSidebar;
