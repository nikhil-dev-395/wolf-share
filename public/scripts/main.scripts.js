/* public/scripts/main.scripts.js */
console.log("main.js");

/* download a file in /download/:uuid route - add confirmation before downloading */

const downloadFileBtn = document.getElementById("downloadFileBtn");
const hiddenDownloadLink = document.getElementById("hiddenDownloadLink");
downloadFileBtn.addEventListener("click", () => {
  const downloadUrl = downloadFileBtn.dataset.downloadUrl;

  if (confirm("Do you want to download this file?")) {
    // Set href and download attributes on the hidden <a> tag
    hiddenDownloadLink.href = downloadUrl;
    hiddenDownloadLink.download = ""; // Optionally specify a filename

    // Programmatically trigger a click on the <a> tag to start the download
    hiddenDownloadLink.click();
  } else {
    hiddenDownloadLink.href = "";
  }
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



