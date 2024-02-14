import React, { useState } from 'react';
import Bio from './Bio.js'; 
import User from './User.js'; 
import './Account.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';


function Account() {
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

    // useEffect(() => {
    //     async function fetchUserData() {
    //         try {
    //             const response = await fetch('endpoint here');
    //             if (response.ok) {
    //                 const userData = await response.json();
    //                 setUser(userData);
    //             } else {
    //                 console.error('Failed to fetch user data');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     }
    //     fetchUserData();
    // }, []);

    // async function updateUser(updateData) {
    //     try {
    //         const response = await fetch('endpoint here', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(updateData)
    //         });
    //         if (response.ok) {
    //             setUser(prevUser => ({
    //                 ...prevUser,
    //                 ...updateData
    //             }));
    //         } else {
    //             console.error('Failed to update user data');
    //         }
    //     } catch (error) {
    //         console.error('Error updating user data:', error);
    //     }
    // }

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
