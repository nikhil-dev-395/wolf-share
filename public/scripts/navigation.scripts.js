// public/navigation.scripts.js
console.log("navigation.js");
let currentLocation = window.location.pathname;

const home = document.getElementById("home");
const account = document.getElementById("account");
const logo = document.getElementById("logo");
const pricing = document.getElementById("pricing");
const cancelBtn = document.getElementById("cancelBtn");
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
console.log(token);

// Update UI based on token presence
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

// this is for testing purpose  only not for use in any feature
