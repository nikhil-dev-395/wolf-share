console.log("main.js");

const prompt_container = document.querySelector(".prompt-container");
prompt_container.style.background = "white";

// creating a elements
const customInput = document.createElement("input");
const customDiv = document.createElement("div");
const backdrop = document.createElement("div");
const customOkButton = document.createElement("button");
const customNoButton = document.createElement("button");
const customOutput = document.createElement("h1");

// adding text in btn
customNoButton.innerText = "Cancel";
customOkButton.innerText = "ok";
//creating a class name for elements
customInput.classList.add("customInput");
customDiv.classList.add("customDiv");
customOkButton.classList.add("customOkButton");
customNoButton.classList.add("customNoButton");

/*creating a class for tailwind use*/
customInput.className =
  "px-3 py-2 w-full rounded-md text-black  border-2 border-sky-500";
customNoButton.className =
  " bg-blue-600 w-24 text-center text-white py-3 px-12 rounded-md shadow-md hover:bg-blue-500 transition-colors duration-300 mx-auto flex items-center gap-2 my-2";
customOkButton.className =
  " bg-blue-600 w-24 text-center text-white py-3 px-12 rounded-md shadow-md hover:bg-blue-500 transition-colors duration-300 mx-auto flex items-center gap-2 my-2";

customDiv.className = "flex justify-between my-4";
backdrop.className =
  "fixed top-0 left-0 w-full h-full bg-black/50 blur-sm z-[999] hidden ";

// custom input some config
customInput.type = "text";
customInput.placeholder = "enter your file name";
customInput.autofocus = true;

// appending a elements
prompt_container.appendChild(customInput);
prompt_container.appendChild(customDiv);
customDiv.appendChild(customOkButton);
customDiv.appendChild(customNoButton);
document.body.appendChild(backdrop);
// getting input text

customOkButton.addEventListener("click", () => {
  console.log(customInput.value);
  const customInputValue = customInput.value;
  console.log(customInputValue);
  showPrompt.style.display = "block";
  prompt_container.style.display = "none";
  backdrop.style.display = "none";
});

/* this is nothing but a button which helps us to displaying a prompt */
const showPrompt = document.getElementById("showPrompt");
showPrompt.addEventListener("click", () => {
  prompt_container.style.display = "block";
  showPrompt.style.display = "none";
  backdrop.style.display = "block";
});

customNoButton.addEventListener("click", () => {
  showPrompt.style.display = "block";
  prompt_container.style.display = "none";
  backdrop.style.display = "none";
});
