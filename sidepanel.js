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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'define-word') {
    showDef(info.selectionText);
  }
});
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
    
    // Example: Extracting definition from the response
    if (Array.isArray(data) && data.length > 0) {
      const firstDefinition = data[0].shortdef[0];
      console.log(`Definition: ${firstDefinition}`);
      document.querySelector('#definition-text').textContent = firstDefinition;
    } else {
      console.log("Word not found in the dictionary.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
   //should equal the Merriam Webster's definition given by the API
}
