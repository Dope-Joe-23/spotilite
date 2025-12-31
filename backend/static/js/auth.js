const endPoint = 'http://127.0.0.1:8000/music/api';


const fetchUserInfo = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error("No access token found!");
        return null;
    }

    // Fetch user info using the access token
    try {
        const response = await fetch(`${endPoint}/user-info/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content": "application/json",
            },
        });

        if (response.ok){
            const userInfo = await response.json();
            return userInfo;
        } 
        else {
            const error = await response.json();
            console.error("Failed to fetch user info:", error);
        }
    } 
    catch (err) {
        console.error("Error finding user info:", err);
    }
    return null;
}

// For User Profile

const updateUserProfile = (userInfo) => {

     const userProfile = document.getElementById("user-profile");
        const profileSpan = document.getElementById("avatar-letter");
        const signinBtn = document.getElementById('signin-button');
        const signupBtn = document.getElementById('signup-button');

        userProfile.classList.remove("hidden");
        profileSpan.textContent = userInfo.username.charAt(0).toUpperCase();
        signinBtn.classList.add("hidden");
        signupBtn.classList.add("hidden");

        userProfile.addEventListener("click", ()=>{
        document.getElementById("dropdown-menu").classList.toggle("hidden");
    });

    window.logout = function () {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("Logged out successfully.");
        window.location.href = "/music/index/";
    }
}

// For Audio player
const showAudioPlayer = () => {
    const audioPlayer = document.getElementById("audio-player");
    audioPlayer.classList.remove("hidden")
}


// Use token to update user profile

async function authenticateUser() {

    const token = localStorage.getItem("accessToken");
    if (!token){
        console.log("No access token found. Skipping UI update.");
        return;
    }

    const userInfo = await fetchUserInfo();

    if (userInfo){
        updateUserProfile(userInfo);
        showAudioPlayer();
        insertUsername();
        showCreatePlaylistForm();

        // Add event listener to the create playlist button
        document.getElementById('create-playlist-button').addEventListener('click', () => {
            window.location.href = "/music/playlist/";
        });
    
    }
}

// Insert username at the required place
async function insertUsername() {
    const userInfo = await fetchUserInfo();

    if (userInfo && userInfo.username) {
        const usernameElements = document.querySelectorAll(".username");
        usernameElements.forEach(element => {
            element.textContent = userInfo.username;
        });
    } else {
        console.error("Failed to fetch or set username.");
    }
};

// Show pop-up form to create a playlist
async function showCreatePlaylistForm() {
    const token = localStorage.getItem("accessToken");

        // Get the necessary elements
        const playlistTitle = document.querySelector('.playlist-title');
        const popup = document.getElementById('playlist-popup');
        const cancelButton = document.getElementById('cancel-button');     
        const form = document.getElementById('playlist-form');

        // Show the popup
        playlistTitle.addEventListener('click', () => {
            popup.classList.remove('hidden');
        });

        // Hide the popup when cancel button is clicked
        cancelButton.addEventListener('click', () => {
            popup.classList.add('hidden');
        });

        // Handle form submission
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById('playlist-title-input').value.trim();
            const description = document.getElementById('playlist-description-input').value.trim();

            try {
                const response = await fetch(`${endPoint}/create-playlist/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    })
                });
                const data = await response.json();
                
                if (response.ok){
                    alert("Playlist created successfully!");
                    console.log("Playlist created:", data);
                }
                else {
                    alert(data.error || "Failed to create playlist.");
                    console.error("Error creating playlist:", data);
                }
            } 
            catch (error) {
                console.error("Error creating playlist:", error);
                alert("An error occurred while creating the playlist.");
            }
            // Hide the popup after saving
            popup.classList.add('hidden');
            
        });;
    
}


document.addEventListener("DOMContentLoaded", () => {
    authenticateUser();
});
