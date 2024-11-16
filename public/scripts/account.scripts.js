/* here we are only going to implement menu buttons of account  */

const updateButtons = document.querySelectorAll("#updateBtn");
updateButtons.forEach((button, index) => {
  const uuid = button.dataset.uuid;
  // const originalFileName = button.dataset.originalFileName;

  button.addEventListener("click", () => {
    const newFileName = prompt("Enter the new file name:");
    fetch("/api/v1/files/updateFile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid,
        originalFileName: newFileName,
      }) /* originalFileName because we are updating this from backend ,  `newFileName` : we are getting this from prompt for new originalName not fileName ,   */,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);

        if (data.success) {
          // Update the displayed file name dynamically
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
      .catch((error) => {
        console.log("error at updating fileName :" + error);
      });
  });
});

/* delete button for single selected file */
const deleteButtons = document.querySelectorAll("#deleteBtn");

deleteButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const uuid = button.dataset.uuid;
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

/* "updateFileIndex" function is used for updating the file index after deleting a file from database*/
const updateFileIndex = () => {
  const remainingFile = document.querySelectorAll(".file-item");
  remainingFile.forEach((file, index) => {
    const fileIndexDisplay = file.querySelector(".file-index");
    if (fileIndexDisplay) {
      fileIndexDisplay.textContent = index + 1;
    }
  });
};
