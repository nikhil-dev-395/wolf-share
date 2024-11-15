/* public/navigation.scripts.js */
console.log("navigation.js");
const home = document.getElementById("home");
const account = document.getElementById("account");
const logo = document.getElementById("logo");
const pricing = document.getElementById("pricing");
const cancelBtn = document.getElementById("cancelBtn");

/* currentLocation - with this we can define color to the icon which related to route like home , account , and pricing */
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
logo.addEventListener("click", () => {
  window.location.pathname = "/";
});

/* Function to access the token from cookies */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Retrieve the token
let token = getCookie("token");
// console.log(token);

/* Update UI based on token presence , if we are logged in then we will be only display logout if not then login button */
let loginButton = document.getElementById("loginButton");
let logoutBtn = document.getElementById("logoutBtn");

loginButton.addEventListener("click", () => {
  window.location.pathname = "/login";
});

if (token) {
  logoutBtn.style.display = "flex"; // Show logout button
  loginButton.style.display = "none"; // Hide login button
} else {
  logoutBtn.style.display = "none"; // Hide logout button
  loginButton.style.display = "flex"; // Show login button
}

/* for dispaying message after uploading file on cloud storage */
const nextBtn = document.getElementById("nextBtn");
const btnContainer = document.getElementById("btn");
const afterUploadMessage = document.getElementById("after-upload-btn-message");
const menuBtnPauseAndResume = document.getElementById(
  "menu-btn-pause-and-resume"
);

nextBtn.addEventListener("click", () => {
  btnContainer.style.display = "none";
  afterUploadMessage.style.display = "flex";
  menuBtnPauseAndResume.style.display = "flex";
});

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

/*resume button for resuming the uploading file on dropbox*/
// Resume button for resuming the uploading file on Dropbox
const resumeBtn = document.getElementById("resume-btn");
const uploadStatus = document.getElementById("upload-status"); // Define uploadStatus here
let isPaused = true; // Assume upload is paused initially

// Resume upload
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
