// content.js
// Content script for storing the words in a database
// using IndexedDB API and implements the highlight feature

// Get the button element by its ID
var storeButton = document.getElementById("storeButton");

// Add a click event listener to the button
storeButton.addEventListener("click", function() {
    storeButton.classList.toggle("clicked");
    storeButton.innerText = "Saved!";
});