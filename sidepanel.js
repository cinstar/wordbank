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

let userWord = 'filler_word';
let userDefinition = 'filler_definition';
let pageURL = ''; 

chrome.runtime.sendMessage('sidePanelIsOpen', showDef);

function showDef(text, definition) {
  document.querySelector('#definition-word').textContent = text;
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
      
      // const container = document.getElementById("definitionsContainer");

      // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

      if (Array.isArray(data) && data.length > 0) {
        const firstDefinition = data[0].shortdef[0];
        // console.log("Sending word: ", wordToLookup);
        // console.log("Sending definition: ", firstDefinition);
        // await chrome.tabs.sendMessage(tab.id, { type: 'wordDefinition', word: wordToLookup, definition: firstDefinition});

        userWord = wordToLookup;
        userDefinition = firstDefinition;

        document.querySelector('#definition-text').textContent = firstDefinition;
      } else {
        console.log("Word not found in the dictionary.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
};

// Get the button element by its ID
var storeButton = document.getElementById("storeButton");
var customDefStoring = document.getElementById("customdef").value;

// Add a click event listener to the button
storeButton.addEventListener("click", function() {
    storeButton.classList.toggle("clicked");
    storeButton.innerText = "Saved!";

    const currentDate = new Date().toLocaleString();

    // Storage operation after the button click
    chrome.storage.sync.get({ words: [] }, function (result) {
        const words = result.words;

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