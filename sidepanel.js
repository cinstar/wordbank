// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.sendMessage('sidePanelIsOpen', showDef);
var userWord; 
var userDefinition = "Error: You did not save a definition for this word";
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'define-word') {
    showDef(info.selectionText);
  }
});
function showDef(text, definition) {
  document.querySelector('#definition-word').textContent = text;
  userWord = text;
  const API_KEY = "667c02e3-50bf-4233-a954-b33d1264799a";
const wordToLookup = text; // Replace with the word you want to look up

// API endpoint
const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordToLookup}?key=${API_KEY}`;

// Fetch data from the Webster Dictionary API
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Process the API response (data) here
    console.log(data);
    
    // Example: Extracting definition from the response
    const container = document.getElementById('definitionsContainer');

    if (Array.isArray(data) && data.length > 0) {
      console.log(data.length, " is the number of definitions of");
      for(var i = 0; i < data.length; i++) {
        const paragraph = document.createElement('p');
        const flOfEach = document.createElement('p');

        const firstDefinition = data[i].shortdef ? data[i].shortdef[0] : "N/A";
        const partOfSpeech = data[i].fl ? data[i].fl : "N/A";

        console.log(`Part of speech: ${partOfSpeech}`);

        flOfEach.textContent = `${partOfSpeech}`;
        flOfEach.className = 'flStyle';

        container.appendChild(flOfEach);

        paragraph.textContent = `${i+1}. \n Definition - ${firstDefinition}`;
        container.appendChild(paragraph);
      }
      console.log("this is our def", userDefinition);
    } else {
      console.log("Word not found in the dictionary.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
   //should equal the Merriam Webster's definition given by the API
}

var storeButton = document.getElementById("storeButton");
var customDefStoring = document.getElementById("customdef").value;
// FIXME: right now the custom definition area doesn't work. it's not getting read here
// console.log("Value of custom definition:", customDefStoring);
var deleteButton = document.getElementById("deleteButton");

// Add a click event listener to the button
storeButton.addEventListener("click", function() {
    storeButton.classList.toggle("clicked");
    storeButton.innerText = "Saved!";
    userDefinition = document.getElementById("customdef").value;
    const currentDate = new Date().toLocaleString();

    // Storage operation after the button click
    chrome.storage.sync.get({ words: [] }, function (result) {
        const words = result.words;
        if(userDefinition === "") {
          userDefinition = "Error: You never put a definition for this word";
        }
        // add words to storage
        words.push({
            word: userWord,
            definition: userDefinition,
            discovered_at: window.location.href,
            // sentence_ex: "sample sentence",
            date_found: currentDate
        });

        // Save the updated array back to storage
        chrome.storage.sync.set({ words: words });
        // Update the displayed stored words
        displayStoredWords();

        console.log("word saved successfully!");
        console.log(words);
    });
});

deleteButton.addEventListener("click", function() {
  storeButton.classList.toggle("clicked");
  storeButton.innerText = "Saved!";

  const currentDate = new Date().toLocaleString();

  // Storage operation after the button click
  chrome.storage.sync.set({ words: [] }, function () {
    // Clear the list by setting the innerHTML to an empty string
    storedWordsList.innerHTML = '';

    console.log("All words deleted successfully!");
  });
});

function displayStoredWords() {
  const storedWordsList = document.getElementById('storedWordsList');
  // Fetch stored words from storage
  chrome.storage.sync.get({ words: [] }, function (result) {
    const words = result.words;

    // Clear existing list
    storedWordsList.innerHTML = '';

    // Add each word to the list
    words.forEach(word => {
      const listItem = document.createElement('li');
      listItem.textContent = `${word.word}: ${word.definition}`;
      storedWordsList.appendChild(listItem);
    });
  });
}
