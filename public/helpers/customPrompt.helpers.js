console.log("customPrompt.js");

const prompt_container = document.querySelector(".prompt-container");
let customInputValue = "";

// creating a elements

const backdrop = document.createElement("div");
// get element by using of  that element
const customInput = document.getElementById("customInput");
const customOkButton = document.getElementById("customOkButton");
const customNoButton = document.getElementById("customNoButton");

// for debugging only you can delete or cut this code as you wish 😊😊
console.log("customOkButton created (before append):", customOkButton);


backdrop.className =
  "fixed top-0 left-0 w-full h-full bg-black/50 blur-sm z-[999] hidden ";

document.body.appendChild(backdrop);

// you can cut this 😊
console.log(
  "customOkButton in DOM:",
  document.querySelector("#customOkButton")
);


// getting input text

customOkButton.addEventListener("click", () => {
  console.log(customInput.value);
  customInputValue = customInput.value;
  console.log(customInputValue);
  showPrompt.style.display = "block";
  prompt_container.style.display = "none";
  backdrop.style.display = "none";
});
// i am exporting this i dont know it going to work or not

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

// export default customInputValue;
export const getCustomInputValue = () => customInputValue;
