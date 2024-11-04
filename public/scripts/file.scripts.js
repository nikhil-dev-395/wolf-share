// file.scripts.js - module.js
console.log("file.js");

// impoting module
import { color } from "../helpers/helpers.helpers.js";

const files_sharing = document.getElementById("file-sharing");
const show = document.getElementById("show");
const fileInfo = document.getElementById("fileInfo");
const dropImg = document.getElementById("dropImg");
const select_file = document.getElementById("select-file");
const displayPreInfo = document.getElementById("displayPreInfo");
const progressBar = document.getElementById("myBar");
const myProgressBar = document.getElementById("myProgressBar");
const progressValue = document.getElementById("value");
const nextBtn = document.getElementById("nextBtn");
const cancelBtn = document.getElementById("cancelBtn");
const select_file_box = document.getElementById("select-file-box");

files_sharing.addEventListener("change", (e) => {
  select_file_box.style.marginTop = "20px";
  nextBtn.style.display = "block";
  cancelBtn.style.display = "block";
  show.style.display = "block";
  show.style.width = "280px";
  show.style.height = "300px";
  show.style.backgroundColor = color.docxBgColor;
  /* following code is for progress bar after uploading a file
   Reset progress bar*/
  myProgressBar.style.display = "block";
  let width = 10;
  progressBar.style.width = width + "%";
  progressValue.innerHTML = width + "%";

  /*Simulating file upload progress*/
  const intervalId = setInterval(() => {
    if (width >= 100) {
      clearInterval(intervalId);
    } else {
      width++;
      progressBar.style.width = width + "%";
      progressValue.innerHTML = width + "%";
    }
  }, 50);

  /*   upto here is the code of progress bar*/

  displayPreInfo.style.display = "none";
  show.style.display = "block";
  const file = e.target.files[0];
  console.log(file);

  const url = URL.createObjectURL(file);
  //   console.log(url);

  if (file) {
    // Check if the file is an image
    if (file.type.startsWith("image/")) {
      // show.style.backgroundImage = `url(${url})`;
      show.style.backgroundSize = "cover";
      show.style.backgroundPosition = "center";
      show.style.backgroundRepeat = "no-repeat";
    } else {
      // For non-image files, you can set a default placeholder background

      show.style.backgroundSize = "cover";
      show.style.backgroundPosition = "center";
      show.style.backgroundRepeat = "no-repeat";
    }

    const filesize = file.size / 1_000_000 + " mb";
    // console.log("file is occurred", file, file.type, file.name, filesize);
    const img = document.createElement("img");

    // embed is going to show the .pdf
    const embed = document.createElement("embed");

    /* li elemets for showing the metadata of files*/
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");

    /* PDF File Handling*/
    if (file.type === "application/pdf") {
      embed.src = url;
      embed.type = "application/pdf";
      embed.style.width = "280px";
      embed.style.height = "300px";
      embed.style.margin = "auto";

      show.append(embed);
    }

    /* images handling from here ...*/
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/svg+xml"
    ) {
      img.src = url;
      img.alt = file.name;
      img.style.width = "280px";
      img.style.height = "300px";
      img.style.margin = "auto";
      img.style.borderRadius = "20px";
      img.style.backgroundSize = "cover";

      show.append(img);
    }

    /*.docx handling from here ..*/
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const arrayBuffer = event.target.result;

        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function (result) {
            show.innerHTML = result.value;
          })
          .catch(function (err) {
            console.error(err);
            alert("Failed to convert the document.");
          });
      };

      reader.readAsArrayBuffer(file);
    }
    /*making drop img hidden after choosing the file */
    dropImg.style.display = "none";
    files_sharing.style.display = "none";

    /* appending the elements in `show` named `id` div*/
    li1.innerHTML = "name : " + file.name;
    li2.innerHTML = "size : " + filesize;
    /* (ternary conditionals) here i added file type conditions so we can text words - i mentioned only lengthy types */
    li3.innerHTML =
      "file type : " +
      (file.type === "application/pdf"
        ? "pdf"
        : file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ? "docx"
        : file.type === "image/png"
        ? "png"
        : file.type === "image/jpg"
        ? "jpg"
        : file.type === "image/jpeg"
        ? "jpeg"
        : file.type === "image/svg+xml"
        ? "svg"
        : file.type);

    fileInfo.append(li1);
    fileInfo.append(li2);
    fileInfo.append(li3);
  }
});
