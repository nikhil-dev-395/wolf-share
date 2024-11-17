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
  customNoButton.style.backgroundColor = "orange";
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

/* Handle delete buttons */
document.querySelectorAll("#deleteBtn").forEach((button, index) => {
  button.addEventListener("click", () => {
    const uuid = button.dataset.uuid;
    if (!uuid) {
      console.error(`Missing UUID for button at index ${index}`);
      return;
    }

    if (!confirm("Are you sure you want to delete this file?")) return;

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

/* Update file indices dynamically */
const updateFileIndex = () => {
  document.querySelectorAll(".file-item").forEach((file, index) => {
    const fileIndexDisplay = file.querySelector(".file-index");
    if (fileIndexDisplay) fileIndexDisplay.textContent = index + 1;
  });
};
