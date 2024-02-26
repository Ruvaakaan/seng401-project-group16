import React, { useState } from "react";
import "./ProfilePicture.css"

function ProfilePicture({ onClose, onProfilePictureChange }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileError(false);
    } else {
      setFileError(true);
    }
  };

  const handleSubmit = () => {
    if (file) {
      // Perform any action with the selected file, such as uploading it
      onProfilePictureChange(file);
      onClose();
    } else {
      setFileError(true);
    }
  };

  return (
        <div className="profile-overlay">
        <div className="profile-content">
            <h1>Change Profile Picture</h1>
            <p>Select an image for your profile</p>
            <label htmlFor="file" id="fileText">
            <input
                id="file"
                type="file"
                required
                accept="image/*"
                onChange={handleFileChange}
            />
            </label>
            {fileError && <label id="error">Please choose an image</label>}
            <div className="buttons"> {/* Buttons container */}
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
            </div>
        </div>
        </div>


  );
}

export default ProfilePicture;
