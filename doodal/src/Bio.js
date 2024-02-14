import React, { useRef } from 'react';
import './Settings.css'; 

function Bio({ isOpen, onClose, onUpdate }) {
    const newBioRef = useRef(null); //Reference to input field

    const handleUpdate = () => {
        const newBio = newBioRef.current.value; //Get the value from the input field
        onUpdate(newBio); //Pass the new bio value to the onUpdate function
        onClose();
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