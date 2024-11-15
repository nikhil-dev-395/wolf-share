/* here we are only going to implement menu buttons of account  */

// const { json } = require("body-parser");

// Assuming this is in a separate script or a <script> tag in the same EJS file

const updateButtons = document.querySelectorAll("#updateBtn");

updateButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const fileDetails = {
      index: index,
    };

    handleUpdate(fileDetails);
  });
});

function handleUpdate(fileDetails) {
  // Redirect to an update form, or open a modal
  alert(`Updating file: ${fileDetails.index}`);
}

/* delete button for single selected file */
const deleteButtons = document.querySelectorAll("#deleteBtn");

deleteButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const uuid = button.dataset.uuid;
    alert(uuid);
    if (!uuid) {
      console.error(`Missing UUID for button at index ${index}`);
      return;
    }

    // Confirm deletion before proceeding
    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    console.log(`Attempting to delete file with UUID: ${uuid}`);

    fetch("/api/v1/files/deleteFile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("File deleted successfully:", data);
        alert("File deleted successfully!");
        // Remove the deleted file's element from the DOM
        const fileItem = button.closest(".file-item");
        if (fileItem) {
          fileItem.remove(); /* Just remove the file item and update the index of file by updateFileIndex */
          updateFileIndex();
        }
      })
      .catch((error) => {
        console.error("Error during file deletion:", error);
      });
  });
});


/* "updateFileIndex" function is used for updating the file index*/
const updateFileIndex = () => {
  const remainingFile = document.querySelectorAll(".file-item");
  remainingFile.forEach((file, index) => {
    const fileIndexDisplay = file.querySelector(".file-index");
    if (fileIndexDisplay) {
      fileIndexDisplay.textContent = index + 1;
    }
  });
};
