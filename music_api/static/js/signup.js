const apiUrl = 'http://127.0.0.1:8000/api'; // Ensure this matches your API's URL


document.addEventListener("DOMContentLoaded", () => {
// Asynchronous submission (AJAX)
const singupForm = document.getElementById("signup-form");

if (singupForm) {
    singupForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${apiUrl}/signup/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok){
            const result = await response.json();
            alert(result.message);

            window.location.href = "/signin/"
        } else {
            const error = await response.json();
            alert(error.error)
        }
    } catch (err) {
        console.error("Error:", err)
        alert("Something went wrong!")
    }
 })
} else {
    console.error("Signup form not found in the DOM")
}
 
})



