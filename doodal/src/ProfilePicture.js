import React, { useState } from "react";
import "./ProfilePicture.css";
import makeApiCall from "./makeApiCall";

function ProfilePicture({ onClose, onProfilePictureChange }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Allowed image types
      
      // Check file size
      if (selectedFile.size > maxSizeInBytes) {
        setFileError("File size exceeds 5MB");
        setFile(null);
        setFileName("")
      } else if (!allowedTypes.includes(selectedFile.type)) {
        // Check file type
        setFileError("Invalid file type. Please select a JPEG, PNG, or GIF file.");
        setFile(null);
        setFileName("")
      } else {
        setFileName(selectedFile.name)
        setFile(selectedFile);
        setFileError(false);
      }
    } else {
      console.log("no file")
      setFileError("Please choose an image");
    }
  };

  async function handleSubmit(){
    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        onProfilePictureChange(imageUrl);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imgData = event.target.result.replace(/^data:image\/(png|jpeg);base64,/, "");
          const jsonData = {
            image_data: imgData
          };
          const jsonString = JSON.stringify(jsonData);
          const response = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/prod/upload_profile_photo`, "POST", jsonString);
          onClose();
        };
        reader.readAsDataURL(file);
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
        {/* Hide the default file input */}
        <input
          id="file"
          type="file"
          style={{ display: 'none' }}
          required
          accept="image/jpeg, image/png, image/gif"
          onChange={handleFileChange}
        />
        {/* Use label to trigger file selection */}
        <label htmlFor="file" id="fileText" className="file-upload-button">
          Click here to select a file
        </label>
        {/* Display the file name */}
        {fileName ? fileName : ""}
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