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
function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'define-word',
    title: 'WordBank It!',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

let text;
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'define-word') {
    chrome.sidePanel.open({ windowId: tab.windowId });
    text = info.selectionText;
  }
});
chrome.runtime.onMessage.addListener((msg, sender, ourFunc) => {
  if (msg === 'sidePanelIsOpen') {
    ourFunc(text);
  }
});

function showDef(data) {
  // Hide instructions.
  document.body.querySelector('#select-a-word').style.display = 'none';

  // Show word.
  document.body.querySelector('#definition-word').innerText = data.value;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'openSidePanel') {
    // Open the side panel and show definition
    chrome.sidePanel.open({ url: 'sidepanel.html' }, (sidePanelWindow) => {
      sidePanelWindow.onload = () => {
        // Callback function after side panel is fully loaded
        showDef(message.data);
      };
    });
  }
});

