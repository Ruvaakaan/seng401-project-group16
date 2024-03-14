import React, { useRef } from 'react';
import './Settings.css';
import makeApiCall from "./makeApiCall";

function Bio({ isOpen, onClose, onUpdate }) {
    const newBioRef = useRef(null); //Reference to input field

    async function handleUpdate(){
        try{
        const newBio = newBioRef.current.value; //Get the value from the input field
        const request = JSON.stringify({
            bio: newBio,
          })
        const response = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/update_bio`, "POST", request);
        onUpdate(newBio); //Pass the new bio value to the onUpdate function
        onClose();
        }
        catch (error) {
            console.error("Error updating bio:", error);
          }
    };

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-content" onClick={(e) => e.stopPropagation()}>
                <h2>Update Bio</h2>
                <input type="text" ref={newBioRef} placeholder="New Bio" />
                <button onClick={handleUpdate}>Update</button>
            </div>
        </div>
    );
}

export default Bio;