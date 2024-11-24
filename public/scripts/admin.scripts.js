const searchBtn = document.getElementById("searchBtn");

// Create the search box
const searchBox = document.createElement("div");
searchBox.innerText = "Search";
searchBox.style.backgroundColor = "#819de3";
searchBox.style.color = "black";
searchBox.style.padding = "10px";
searchBox.style.borderRadius = "8px";
searchBox.style.position = "absolute";
searchBox.style.display = "none"; // Initially hidden
searchBox.style.marginTop = "10px";
searchBox.style.marginBottom = "10px";
document.body.appendChild(searchBox);

// Show the search box on hover
searchBtn.addEventListener("mouseover", (e) => {
  searchBox.style.display = "block";
  // Position the search box near the button
  const rect = searchBtn.getBoundingClientRect();
  searchBox.style.left = `${rect.left}px`;
  searchBox.style.top = `${rect.bottom + window.scrollY}px`;
});

// Hide the search box when the mouse leaves
searchBtn.addEventListener("mouseout", () => {
  searchBox.style.display = "none";
});
