/*auth.scripts.js*/
console.log("auth.scripts.js");

/*after message of sharing file to receiver */

const sendFileFormBtn = document.getElementById("sendFileFormBtn");
const afterSendFileMessage = document.getElementById("after-sendFile-message");
sendFileFormBtn.addEventListener("click", () => {
  sendFileFormBtn.style.display = "none"; // Hide the button
  afterSendFileMessage.classList.remove("hidden"); // Show the message
});



/*following code is used for show and hide the password*/
const password = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/*showPassword function is used for hiding and showing password type & icons*/
const showPassword = () => {
  if (password.type === "password") {
    password.type = "text";
    showpass.src = "/icons/hidePassword.svg";
  } else {
    password.type = "password";
    showpass.src = "/icons/password.svg";
  }
};

/* Confirm Logout */
const confirmLogout = (callback) => {
  // Create the backdrop for background blur
  const backdrop = document.createElement("div");
  backdrop.className =
    "fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[999]";
  backdrop.style.zIndex = "1000";
  // Create the dialog container
  const dialogContainer = document.createElement("div");
  dialogContainer.className =
    "bg-white p-6 rounded-lg shadow-lg w-96 text-center space-y-4";

  // Confirm logout message
  const confirmLogoutMessage = document.createElement("p");
  confirmLogoutMessage.innerText = "Are you sure you want to logout?";
  confirmLogoutMessage.style.color = "black";
  confirmLogoutMessage.style.fontSize = "17px";
  confirmLogoutMessage.className = "text-gray-800";

  // Yes button for logout
  const logoutOkBtn = document.createElement("button");
  logoutOkBtn.innerText = "Yes";
  logoutOkBtn.className =
    "bg-yellow-500 text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition";
  logoutOkBtn.addEventListener("click", () => {
    callback(true);
    document.body.removeChild(backdrop); // Remove the backdrop
  });

  // No button to cancel
  const logoutCancelBtn = document.createElement("button");
  logoutCancelBtn.innerText = "No";
  logoutCancelBtn.style.color = "black";
  logoutCancelBtn.style.backgroundColor = "#b06a7c";
  logoutCancelBtn.className =
    "bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition";
  logoutCancelBtn.addEventListener("click", () => {
    callback(false);
    document.body.removeChild(backdrop); // Remove the backdrop
  });

  // Button container
  const btnContainer = document.createElement("div");
  btnContainer.className = "flex justify-around mt-4";
  btnContainer.appendChild(logoutOkBtn);
  btnContainer.appendChild(logoutCancelBtn);

  // Append elements to dialog container
  dialogContainer.appendChild(confirmLogoutMessage);
  dialogContainer.appendChild(btnContainer);

  // Append dialog container to backdrop
  backdrop.appendChild(dialogContainer);

  // Append backdrop to body
  document.body.appendChild(backdrop);
};

/* Logout Function */
const logout = () => {
  confirmLogout((confirmed) => {
    if (confirmed) {
      // Clear all cookies
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      });

      // Redirect to login page
      window.location.pathname = "/login";
    }
  });
};
