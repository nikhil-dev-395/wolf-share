const customDropBoxOpenConfirm = (callback) => {
  // Overlay
  const overlay = document.createElement("div");
  overlay.style.zIndex = "1000";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

  // Confirmation Box
  const confirmBox = document.createElement("div");
  confirmBox.style.backgroundColor = "#0F172A";
  confirmBox.style.border = "1px solid #ffffff"; // Corrected the border color
  confirmBox.style.padding = "20px";
  confirmBox.style.borderRadius = "8px";
  confirmBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  confirmBox.style.textAlign = "center";
  confirmBox.style.gap = "30px";

  // Confirmation Message
  const confirmMsg = document.createElement("p");
  confirmMsg.innerText = "Do you want to open this file via dropbox editor?";
  confirmMsg.style.fontSize = "16px";
  confirmMsg.style.color = "slategray"; // Corrected the color name
  confirmMsg.style.marginBottom = "20px";

  // Share Button
  const confirmShareButton = document.createElement("button");
  confirmShareButton.style.border = "1px solid white"; // Corrected border
  confirmShareButton.style.color = "#fff";
  confirmShareButton.style.padding = "10px 12px";
  confirmShareButton.style.borderRadius = "5px";
  confirmShareButton.style.marginRight = "10px";
  confirmShareButton.innerText = "open";
  confirmShareButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    callback(true);
  });

  // Cancel Button
  const cancelShareButton = document.createElement("button");
  cancelShareButton.style.border = "1px solid white"; // Corrected border

  cancelShareButton.style.color = "#fff";
  cancelShareButton.style.padding = "10px 12px";
  //   cancelShareButton.style.border = "none";
  cancelShareButton.style.borderRadius = "5px";
  cancelShareButton.innerText = "Cancel";
  cancelShareButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    callback(false);
  });

  // Appending elements
  confirmBox.appendChild(confirmMsg);
  confirmBox.appendChild(confirmShareButton);
  confirmBox.appendChild(cancelShareButton);
  overlay.appendChild(confirmBox);
  document.body.appendChild(overlay);
};

/** for sharedLink to open on cloud storage */

const sharedFileUrls = document.querySelectorAll("#sharedFile_url");

sharedFileUrls.forEach((button) => {
  const url = button.dataset.sharedUrl; // Access dataset inside the loop for each button
  button.addEventListener("click", () => {
    customDropBoxOpenConfirm((confirmed) => {
      if (confirmed) {
        window.open(url, "_blank");
      }
    });
  });
});
