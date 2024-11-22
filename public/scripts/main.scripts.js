/* public/scripts/main.scripts.js */
console.log("main.js");

/* Add confirm donwload popup page */

// Confirm download function
const confirmDownloadFileBtn = (callback) => {
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

  const alertBox = document.createElement("div");
  alertBox.style.width = "400px";
  alertBox.style.padding = "20px";
  alertBox.style.backgroundColor = "white";
  alertBox.style.borderRadius = "10px";
  alertBox.style.textAlign = "center";

  const message = document.createElement("p");
  message.innerText = "Do you want to download this file?";
  message.style.color = "black";
  message.style.marginBottom = " 26px";
  alertBox.appendChild(message);

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Yes";
  confirmButton.style.backgroundColor = "green"; // purple for confirmation
  confirmButton.style.color = "white";
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "8px";
  confirmButton.style.padding = "10px 20px";
  confirmButton.style.cursor = "pointer";
  confirmButton.style.fontSize = "14px";
  confirmButton.style.margin = "0 10px";

  confirmButton.addEventListener("click", () => {
    callback(true);
    overlay.remove();
  });

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "No";
  cancelButton.style.backgroundColor = "#ef4444"; // Red for cancellation
  cancelButton.style.color = "white";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "8px";
  cancelButton.style.padding = "10px 20px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.fontSize = "14px";
  cancelButton.style.margin = "0 10px";
  cancelButton.addEventListener("click", () => {
    callback(false);
    overlay.remove();
  });

  alertBox.appendChild(confirmButton);
  alertBox.appendChild(cancelButton);
  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);
};

/* download a file in /download/:uuid route - add confirmation before downloading */
const downloadFileBtn = document.getElementById("downloadFileBtn");
const hiddenDownloadLink = document.getElementById("hiddenDownloadLink");
downloadFileBtn.addEventListener("click", () => {
  const downloadUrl = downloadFileBtn.dataset.downloadUrl;

  confirmDownloadFileBtn((confirmed) => {
    if (confirmed) {
      // Set href and download attributes on the hidden <a> tag
      hiddenDownloadLink.href = downloadUrl;
      hiddenDownloadLink.download = ""; // Optionally specify a filename

      // Programmatically trigger a click on the <a> tag to start the download
      hiddenDownloadLink.click();
    } else {
      hiddenDownloadLink.href = "";
    }
  });
});

/* pause the uploading file - /pause-upload */
const pause_upload = document.getElementById("pause-btn");
pause_upload.addEventListener("click", () => {
  alert("pause btn");
});

/* menu btns of account page */
const shareBtn = document.getElementById("shareBtn");
// const download_url = document.
const shareData = {
  url: shareBtn.dataset.downloadUrl,
};
shareBtn.addEventListener("click", async () => {
  try {
    await navigator.share(shareData);
    alert("files shared successfully");
  } catch (error) {
    console.log("error occurred at sharing file", error);
  }
});

const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
  alert("delete btn clicked");
});
