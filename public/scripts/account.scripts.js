/* Function to show custom prompt */
const showCustomPrompt = (callback) => {
  const promptContainer = document.querySelector(".prompt-container");
  const backdrop = document.createElement("div");
  backdrop.className =
    "fixed top-0 left-0 w-full h-full bg-black/50 blur-sm z-[999]";

  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "Enter the new file name";
  customInput.className =
    "px-3 py-2 w-full rounded-md text-black border-2 border-sky-500";

  const customOkButton = document.createElement("button");
  customOkButton.textContent = "OK";
  customOkButton.className =
    "bg-blue-600 py-3 px-4 hover:bg-blue-800 rounded-md";

  const customNoButton = document.createElement("button");
  customNoButton.textContent = "Cancel";
  customNoButton.style.backgroundColor = "yellow";
  customNoButton.style.color = "black";
  customNoButton.className = " py-3 px-4 hover:bg-gray-800 rounded-md";

  const customDiv = document.createElement("div");
  customDiv.className = "flex justify-between mt-8";
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
  customAlertBox.style.backgroundColor = "white";
  customAlertBox.style.borderRadius = "10px";
  customAlertBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  customAlertBox.style.textAlign = "center";

  // Alert message
  const createAlertMsg = document.createElement("p");
  createAlertMsg.innerText = "Are you sure you want to delete this file?";
  createAlertMsg.style.fontSize = "16px";
  createAlertMsg.style.color = "black";
  createAlertMsg.style.marginBottom = "20px";

  // OK button
  const customAlertOK = document.createElement("button");
  customAlertOK.innerText = "Delete";
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
  confirmButton.style.backgroundColor = "#28a745"; // Green for confirmation
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
  cancelButton.style.backgroundColor = "#dc3545"; // Red for cancellation
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
