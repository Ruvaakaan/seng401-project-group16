import React, { useState, useEffect } from "react";
import Bio from './Bio.js'; 
import User from './User.js'; 
import './Account.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';


function Account({authenticationToken}) { // Receive authenticationToken as a prop
    //User state
    const [user, setUser] = useState({
        username: "example_user",
        email: "example@example.com",
        bio: "Bio here",
        exp: 550,
    });

    //Calculate the level based on experience points
    function calculateLevel(exp) {
        let level = 1;
        let expNeeded = 100;
    
        while (exp >= expNeeded) {
            level++;
            expNeeded += level * 100;
        }
        return level;
    }

    //Settings state
    const [isBioOpen, setIsBioOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    //Function to update user bio
    function updateBio(newBio) {
        setUser(prevUser => ({
            ...prevUser,
            bio: newBio || prevUser.bio,
        }));
        setIsBioOpen(false);
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                console.log("Authentication Token:", authenticationToken); // Access authenticationToken directly
                if (!authenticationToken) {
                    console.error('Authentication token is missing');
                    return;
                }
    
                const response = await fetch('https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/getdata', {
                    headers: {
                        Authorization: authenticationToken
                    }
                });
    
                // Check if the response status is 0, indicating that it's a CORS preflight request
                if (response.status === 0) {
                    console.log('CORS preflight request');
                    return;
                }
    
                // If the response status is not 0, proceed with handling the response
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    
        fetchUserData();
    }, [authenticationToken]); // Add authenticationToken as a dependency
    
    
    //Function to update username
    function updateUsername(newUsername) {
        setUser(prevUser => ({
            ...prevUser,
            username: newUsername || prevUser.username,
        }));
        setIsUserOpen(false);
    }

    return (
        <div className="account-container">
            <div className="user-info">
                <img src="https://i.etsystatic.com/16421349/r/il/c49bf5/2978449787/il_fullxfull.2978449787_hgl5.jpg" alt="Profile" className="profile-picture" />
                <h2>
                    Hello {user.username}!
                    <span className="edit-icon" onClick={() => setIsUserOpen(true)}>
                        &#xf044; 
                    </span>
                </h2>
                <div className="exp-bar">
                    <h2>Level {(calculateLevel(user.exp))}</h2>
                    <div className="exp-progress">
                        <div className="exp-fill" style={{ width: `${(user.exp % (calculateLevel(user.exp)* 100)) / (calculateLevel(user.exp) * 100) * 100}%` }}></div>
                    </div>
                    <p>{user.exp % (calculateLevel(user.exp)* 100)} / {(calculateLevel(user.exp) * 100)} EXP</p>
                </div>
                <h2>
                    Bio 
                    <span className="edit-icon" onClick={() => setIsBioOpen(true)}>
                        &#xf044;
                    </span>
                </h2>
                <p>{user.bio}</p>
            </div>

            <div className="image-gallery">
            </div>

            <Bio
                isOpen={isBioOpen}
                onClose={() => setIsBioOpen(false)}
                onUpdate={updateBio}
            />

            <User
                isOpen={isUserOpen}
                onClose={() => setIsUserOpen(false)}
                onUpdate={updateUsername}
            />
        </div>
    );
}

export default Account;
