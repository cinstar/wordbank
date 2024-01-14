// HIGHLIGHTING FEATURE :D
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