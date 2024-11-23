/*  logout */

function clearAllCookies() {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

/*custom confirm for logout from app*/
const customLogoutConfirm = (callback) => {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "1000";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  // Create alert box
  const customAlertBox = document.createElement("div");
  customAlertBox.style.width = "400px";
  customAlertBox.style.padding = "20px";
  customAlertBox.style.backgroundColor = "white";
  customAlertBox.style.borderRadius = "10px";
  customAlertBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  customAlertBox.style.textAlign = "center";

  // Alert message
  const createAlertMsg = document.createElement("p");
  createAlertMsg.innerText = "Are you sure for logout ?";
  createAlertMsg.style.fontSize = "16px";
  createAlertMsg.style.color = "black";
  createAlertMsg.style.marginBottom = "20px";

  // OK button
  const customAlertOK = document.createElement("button");
  customAlertOK.innerText = "Logout";
  customAlertOK.style.padding = "10px 20px";
  customAlertOK.style.margin = "0 10px";
  customAlertOK.style.backgroundColor = "yellow";
  customAlertOK.style.color = "black";
  customAlertOK.style.border = "none";
  customAlertOK.style.borderRadius = "5px";
  customAlertOK.style.cursor = "pointer";

  customAlertOK.addEventListener("click", () => {
    callback(true);
    overlay.remove(); // Remove the alert box
  });

  // Cancel button
  const customAlertCancel = document.createElement("button");
  customAlertCancel.innerText = "Cancel";
  customAlertCancel.style.padding = "10px 20px";
  customAlertCancel.style.margin = "0 10px";
  customAlertCancel.style.backgroundColor = "gray";
  customAlertCancel.style.color = "white";
  customAlertCancel.style.border = "none";
  customAlertCancel.style.borderRadius = "5px";
  customAlertCancel.style.cursor = "pointer";

  customAlertCancel.addEventListener("click", () => {
    callback(false);
    overlay.remove(); // Remove the alert box
  });

  // Append elements
  customAlertBox.appendChild(createAlertMsg);
  customAlertBox.appendChild(customAlertOK);
  customAlertBox.appendChild(customAlertCancel);
  overlay.appendChild(customAlertBox);
  document.body.appendChild(overlay);
};

document.querySelector("#logoutBtn").addEventListener("click", () => {
  customLogoutConfirm((confirmed) => {
    if (confirmed) {
      clearAllCookies();
      window.location.href = "/login";
    }
  });
});
