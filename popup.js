'use strict';

let powerButton = document.getElementById('powerButton');

// Updates popup to display if extension in on or off
const update = () => {
  chrome.storage.sync.get('on', data => {
    powerButton.style.backgroundColor = data.on ? 'green' : 'red';
    powerButton.innerHTML = data.on ? 'On' : 'Off';
  });
};

// Turns extension on and off
powerButton.onclick = event => {

  // Find if the button was on or off
  const power = event.target.innerHTML === 'On' ? true : false;

  // Toggle the power
  chrome.storage.sync.set({ on: !power }, () => {

    // Activate extension or reload page in our tab
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, tabs => {

      // Sends message to our content script
      chrome.tabs.sendMessage(tabs[0].id, !power ? 'run' : 'refresh');
    });

    update();
  });
};

update();
