import React, { useState } from "react";
import "./ProfilePicture.css";
import makeApiCall from "./makeApiCall";

function ProfilePicture({ onClose, onProfilePictureChange }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Allowed image types

      // Check file size
      if (selectedFile.size > maxSizeInBytes) {
        setFileError("File size exceeds 5MB");
        setFile(null);
      } else if (!allowedTypes.includes(selectedFile.type)) {
        // Check file type
        setFileError("Invalid file type. Please select a JPEG, PNG, or GIF file.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setFileError(false);
      }
    } else {
      setFileError("Please choose an image");
      setFile(null);
    }
  };

  async function handleSubmit(){
    if (file) {
      try {
        onProfilePictureChange(file);
        const formData = new FormData();
        formData.append("image_data", file);
        const response = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/upload_profile_photo`, "POST", formData);
        onClose();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
  
    } else {
      setFileError("Please choose an image");
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
            accept="image/jpeg, image/png, image/gif"
            onChange={handleFileChange}
          />
        </label>
        {fileError && <label id="error">{fileError}</label>}
        <div className="buttons">
          {/* Buttons container */}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePicture;
