// alert('Hello world from content.js');

// const wbHighlighter = document.createElement("wb-highlighter");
// document.body.appendChild(wbHighlighter);

/* const setMarkerPosition = (markerPosition) =>
  wbHighlighter.setAttribute(
    "markerPosition",
    JSON.stringify(markerPosition)
  );

const getSelectedText = () => window.getSelection().toString();

document.addEventListener("click", () => {
  if (getSelectedText().length > 0) { // when a fragment is selected
    setMarkerPosition(getMarkerPosition()); // get the position
  }
});

document.addEventListener("selectionchange", () => {
  if (getSelectedText().length === 0) {
    setMarkerPosition({ display: "none" });
  }
});

function getMarkerPosition() {
  const rangeBounds = window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect();
  console.log("getMarkerPosition");
  return {
    // Substract width of marker button -> 40px / 2 = 20
    left: rangeBounds.left + rangeBounds.width / 2 - 20,
    top: rangeBounds.top - 30,
    display: "flex"
  };
} */

/* // Your parsing logic goes here
function parsePage() {
    const myArray = ["coffee", "beverage", "beans"];
    // Example: Get all paragraph text
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        const words = paragraph.textContent.split(/\s+/);

        // Log the individual words
        words.forEach(word => {
          if (myArray.includes(word)) {
            console.log(`Found word: ${word}`);
            // word.style.backgroundColor = "yellow";
            const span = document.createElement("span");
            span.style.backgroundColor = "yellow";
          }
        });
    });
}

// Execute the parsing function when the page is loaded
window.onload = parsePage; */

/* // Define the array of words to check
const myArray = ["coffee", "beverage", "beans"];

// Function to check for the presence of words
function checkForWords() {
  // Get the entire text content of the page
  const pageText = document.body.innerText.toLowerCase();

  // Check each word in the array
  myArray.forEach(word => {
    if (pageText.includes(word)) {
      console.log(`Found word: ${word}`);
      const wbHighlighter = document.createElement("wb-highlighter");
      document.body.appendChild(wbHighlighter);
    }
  });
}

// Execute the function when the page is loaded
window.onload = checkForWords;
 */

const highlightColor = "rgb(224, 187, 228)";
const textColor = "rgb(0, 0, 0)";

// Define the array of words to check
const myArray = ["coffee", "beverage", "beans"];

// Function to change background color for matching words
function changeBackgroundColorForWords() {
  // Get all text nodes on the page
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  // Iterate over each text node
  while (textNodes.nextNode()) {
    const textNode = textNodes.currentNode;
    const textContent = textNode.nodeValue.toLowerCase();

    // Check each word in the array
    myArray.forEach(word => {
      if (textContent.includes(word)) {
        // Create a span element and apply a style
        const span = document.createElement("span");
        span.style.backgroundColor = highlightColor; // Change the background color to your desired color
        span.style.color = textColor;
        span.textContent = word;

        // Replace the word in the text node with the styled span
        const replacedNode = textNode.splitText(textContent.indexOf(word));
        replacedNode.nodeValue = replacedNode.nodeValue.substring(word.length);
        textNode.parentNode.insertBefore(span, replacedNode);
      }
    });

    textNodes.nextNode();
  }
}

// Execute the function when the page is loaded
window.onload = changeBackgroundColorForWords;