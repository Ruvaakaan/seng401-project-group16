import React, { useRef } from 'react';
import './Settings.css'; 

function User({ isOpen, onClose, onUpdate }) {
    const newUserRef = useRef(null); //Reference to input field

    const handleUpdate = () => {
        const newUsername = newUserRef.current.value; //Get the value from the input field
        onUpdate(newUsername); //Pass the new username value to the onUpdate function
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-content" onClick={(e) => e.stopPropagation()}>
                <h2>Update Username</h2>
                <input type="text" ref={newUserRef} placeholder="New Username" />
                <button onClick={handleUpdate}>Update</button>
            </div>
        </div>
    );
}

export default User;
