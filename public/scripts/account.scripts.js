/* Function to show custom prompt */
const showCustomPrompt = (callback) => {
  const promptContainer = document.querySelector(".prompt-container");
  const backdrop = document.createElement("div");

  backdrop.style.position = "fixed";
  backdrop.style.top = "0";
  backdrop.style.left = "0";
  backdrop.style.width = "100%";
  backdrop.style.height = "100%";
  backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // equivalent to bg-black/50
  backdrop.style.filter = "blur(4px)"; // equivalent to blur-md
  backdrop.style.zIndex = "999";

  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "Enter the new file name";
  customInput.style.fontSize = " 12px";
  customInput.style.backgroundColor = "transparent";
  customInput.style.color = "white";
  customInput.style.border = "1px solid white";
  customInput.style.padding = "10px 13px";
  customInput.style.borderRadius = "10px";
  customInput.style.width = "100%";
  customInput.style.margin = "auto";

  const customOkButton = document.createElement("button");
  customOkButton.textContent = "update";
  customOkButton.style.color = "white";
  customOkButton.style.border = "1px solid white";
  customOkButton.style.padding = "10px 13px";
  customOkButton.style.borderRadius = "10px";

  const customNoButton = document.createElement("button");
  customNoButton.textContent = "Cancel";
  customNoButton.style.color = "white";
  customNoButton.style.border = "1px solid white";
  customNoButton.style.padding = "10px 13px";
  customNoButton.style.borderRadius = "10px";

  const customDiv = document.createElement("div");
  // customDiv.className = "flex justify-between mt-8";
  customDiv.style.display = "flex";
  // customDiv.style.width = "100%";
  customDiv.style.justifyContent = "space-around";
  customDiv.style.marginTop = "20px";

  customDiv.appendChild(customOkButton);
  customDiv.appendChild(customNoButton);
  promptContainer.innerHTML = ""; // Clear any existing content
  promptContainer.appendChild(customInput);
  promptContainer.appendChild(customDiv);
  document.body.appendChild(backdrop);

  customOkButton.addEventListener("click", () => {
    const value = customInput.value.trim();
    if (value) callback(value);
    promptContainer.style.display = "none";
    backdrop.remove();
  });

  customNoButton.addEventListener("click", () => {
    promptContainer.style.display = "none";
    backdrop.remove();
  });

  promptContainer.style.display = "block";
};

/* Handle update buttons */
document.querySelectorAll("#updateBtn").forEach((button) => {
  button.addEventListener("click", () => {
    const uuid = button.dataset.uuid;
    if (!uuid) {
      console.error("Missing UUID");
      return;
    }

    showCustomPrompt((newFileName) => {
      fetch("/api/v1/files/updateFile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, originalFileName: newFileName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            button
              .closest(".file-item")
              .querySelector(".text-purple-500").innerHTML = `
              ${data.updateOneFile.originalFileName} -
              <small class="text-slate-400">${data.updateOneFile.filename}</small>
            `;
          } else {
            alert("Error updating file name: " + data.message);
          }
        })
        .catch((error) => console.error("Error updating file name:", error));
    });
  });
});

// custom delete alert box
// custom delete alert box
const customConfirm = (callback) => {
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
  customAlertBox.style.backgroundColor = "#0F172A";
  customAlertBox.style.borderRadius = "10px";
  customAlertBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  customAlertBox.style.textAlign = "center";

  // Alert message
  const createAlertMsg = document.createElement("p");
  createAlertMsg.innerText = "Are you sure you want to delete this file?";
  createAlertMsg.style.fontSize = "16px";
  createAlertMsg.style.color = "white";
  createAlertMsg.style.marginBottom = "20px";

  // OK button
  const customAlertOK = document.createElement("button");
  customAlertOK.innerText = "Delete";
  customAlertOK.style.padding = "10px 20px";
  customAlertOK.style.margin = "0 10px";
  // customAlertOK.style.backgroundColor = "yellow";
  customAlertOK.style.border = "1px solid white"; // Corrected border

  customAlertOK.style.color = "white";
  // customAlertOK.style.border = "none";
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
  // customAlertCancel.style.backgroundColor = "gray";
  customAlertCancel.style.border = "1px solid white"; // Corrected border

  customAlertCancel.style.color = "white";
  // customAlertCancel.style.border = "none";
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

// Handle delete buttons
document.querySelectorAll("#deleteBtn").forEach((button, index) => {
  button.addEventListener("click", () => {
    const uuid = button.dataset.uuid;
    if (!uuid) {
      console.error(`Missing UUID for button at index ${index}`);
      return;
    }

    // Use customConfirm for confirmation
    customConfirm((confirmed) => {
      if (!confirmed) return;

      // Proceed with file deletion
      fetch("/api/v1/files/deleteFile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid }),
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(`Server responded with status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const fileItem = button.closest(".file-item");
          if (fileItem) {
            fileItem.remove();
            updateFileIndex();
          }
        })
        .catch((error) => console.error("Error during file deletion:", error));
    });
  });
});

// Update file indices dynamically
const updateFileIndex = () => {
  document.querySelectorAll(".file-item").forEach((file, index) => {
    const fileIndexDisplay = file.querySelector(".file-index");
    if (fileIndexDisplay) fileIndexDisplay.textContent = index + 1;
  });
};

// Confirm download function
const downloadFileConfirm = (callback) => {
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
  alertBox.style.backgroundColor = "#0F172A";
  alertBox.style.borderRadius = "10px";
  alertBox.style.textAlign = "center";

  const message = document.createElement("p");
  message.innerText = "Do you want to download this file?";
  message.style.color = "white";
  message.style.marginBottom = " 26px";
  alertBox.appendChild(message);

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Yes";
  confirmButton.style.backgroundColor = "#0F172A"; // purple for confirmation
  confirmButton.style.color = "white";
  confirmButton.style.border = "1px solid white";
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
  // cancelButton.style.backgroundColor = "#ef4444"; // Red for cancellation
  cancelButton.style.color = "white";
  cancelButton.style.border = "1px solid white";
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

// Attach event listeners to buttons
document.querySelectorAll(".downloadBtn").forEach((button) => {
  button.addEventListener("click", () => {
    const downloadUrl = button.getAttribute("data-download-url"); // Correctly fetch the attribute
    downloadFileConfirm((confirmed) => {
      if (confirmed) {
        // Trigger file download
        window.open(downloadUrl);
      }
    });
  });
});
