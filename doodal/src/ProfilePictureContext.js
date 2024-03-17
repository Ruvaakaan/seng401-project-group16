import React, { createContext, useContext, useState } from "react";

const ProfilePictureContext = createContext();

export const useProfilePicture = () => useContext(ProfilePictureContext);

export const ProfilePictureProvider = ({ children }) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const updateProfilePictureUrl = (imageUrl) => {
    setProfilePictureUrl(imageUrl);
  };

  return (
    <ProfilePictureContext.Provider value={{ profilePictureUrl, updateProfilePictureUrl }}>
      {children}
    </ProfilePictureContext.Provider>
  );
};
