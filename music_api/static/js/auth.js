const endPoint = 'http://127.0.0.1:8000/api';


const fetchUserInfo = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error("No access token found!");
        return null;
    }
    
    console.log("Access token:", token);

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
            console.log("User Info:", userInfo);
            return userInfo;
        } else {
            const error = await response.json();
            console.error("Failed to fetch user info:", error);
        }
    } catch (err) {
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
        window.location.href = "/"
    }
}

// For Audio player
const showAudioPlayer = () => {
    const audioPlayer = document.getElementById("audio-player");
    audioPlayer.classList.remove("hidden")
}



// Use token to update user profile

async function updateUserInterface() {

    console.log("updating user profile")

    const token = localStorage.getItem("accessToken");
    if (!token){
        console.log("No access token found. Skipping UI update.");
        return;
    }
    const userInfo = await fetchUserInfo();

    if (userInfo){
        updateUserProfile(userInfo);
        showAudioPlayer();
    }
    
    
    
}

updateUserInterface();