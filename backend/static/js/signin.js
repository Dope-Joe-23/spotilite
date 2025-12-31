const apiUrl = 'http://127.0.0.1:8000/music/api';


document.addEventListener("DOMContentLoaded", () => {

const signinForm = document.getElementById("signin-form");

if (signinForm){
    signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    try{
        const response = await fetch(`${apiUrl}/signin/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
            },
            body: JSON.stringify({username, password}),
        });
        const data = await response.json();

        if (response.ok){
            alert("Sign in successful!")
            console.log("Tokens:", data)

            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            console.log(localStorage.getItem("accessToken"));
            console.log(localStorage.getItem("refreshToken"));

            window.location.href = "/music/index/"
            
        } else {
            alert(data.error || "sign in failed")
        }
    } catch (error){
        console.error("sign in error:", error)
        alert("An error occured. Please try agin later.")
    } 
} )
} else {
        console.error("Sign-in form not found in the DOM.");
    }

})




