/* public/navigation.scripts.js */
console.log("navigation.js");
const home = document.getElementById("home");
const account = document.getElementById("account");
const logo = document.getElementById("logo");
const pricing = document.getElementById("pricing");
const cancelBtn = document.getElementById("cancelBtn");

// Set background color for active route
let currentLocation = window.location.pathname;
if (currentLocation == "/account") {
  account.style.backgroundColor = "yellow";
}
if (currentLocation == "/pricing") {
  pricing.style.backgroundColor = "yellow";
}
if (currentLocation == "/") {
  home.style.backgroundColor = "yellow";
}

// Event listener to navigate back to the home page
logo.addEventListener("click", () => {
  window.location.pathname = "/";
});

// Function to access the token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Retrieve the token from cookies
let token = getCookie("token");
console.log("Token:", token); // Debugging - check the token value

// Elements for login/logout buttons
let loginButton = document.getElementById("loginButton");
let logoutBtn = document.getElementById("logoutBtn");

// Update UI based on token presence
if (token) {
  logoutBtn.style.display = "flex"; // Show logout button
  loginButton.style.display = "none"; // Hide login button
} else {
  logoutBtn.style.display = "none"; // Hide logout button
  loginButton.style.display = "flex"; // Show login button
}



// For displaying message after uploading file on cloud storage
const nextBtn = document.getElementById("nextBtn");
const btnContainer = document.getElementById("btn");
const afterUploadMessage = document.getElementById("after-upload-btn-message");
const menuBtnPauseAndResume = document.getElementById(
  "menu-btn-pause-and-resume"
);

nextBtn.addEventListener("click", () => {
  menuBtnPauseAndResume.classList.remove("hidden"); // Make it visible
  btnContainer.style.display = "none"; // Hide the button container
  afterUploadMessage.style.display = "block"; // Show the upload message
  menuBtnPauseAndResume.style.display = "flex"; // Ensure it's flex for alignment
});

// Pause upload button functionality
const pauseBtn = document.getElementById("pause-btn");
pauseBtn.addEventListener("click", () => {
  fetch("/api/v1/files/pause-upload", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Upload paused") {
        // Update UI to inform the user that the upload has been paused
        document.getElementById("upload-status").textContent = "Upload paused";
        // Optionally, disable the pause button after clicking
        document.getElementById("pause-btn").disabled = true;
      }
    })
    .catch((error) => console.error("Error pausing upload:", error));
});

// Resume upload button functionality
const resumeBtn = document.getElementById("resume-btn");
const uploadStatus = document.getElementById("upload-status"); // Define uploadStatus here
let isPaused = true; // Assume upload is paused initially

resumeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/api/v1/files/resume-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Upload resumed") {
        isPaused = false;
        uploadStatus.textContent = "Status: Resuming upload..."; // Set the status text
        resumeBtn.disabled = true; // Disable resume button after resuming
        pauseBtn.disabled = false; // Re-enable pause button if needed
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
