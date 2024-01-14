// contentScript.js

// Get the page content
const pageContent = document.body.textContent;

// Send a message to the service worker to check words
chrome.runtime.sendMessage({ type: 'checkWords', pageContent: pageContent });

