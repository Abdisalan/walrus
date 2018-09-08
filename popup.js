'use strict';

// calculate the date in 24 hours
const nextDay = () => {
  return new Date(Date.now() + 86400000).toJSON();
}

let powerButton = document.getElementById('powerButton');
let offMessage = document.getElementById('offMessage');

// Updates popup to display if extension in on or off
const update = () => {
  chrome.storage.sync.get(null, data => {
    powerButton.style.backgroundColor = data.on ? 'green' : 'red';
    offMessage.innerHTML = data.on ? '' : `Off Until ${new Date(data.tomorrow).toLocaleString()}`;
    powerButton.innerHTML = data.on ? 'On' : 'Off';
  });
};

// Turns extension on and off
powerButton.onclick = event => {

  // Find if the button was on or off
  const power = event.target.innerHTML === 'On' ? true : false;
  const tomorrow = nextDay();

  // Toggle the power
  chrome.storage.sync.set({ on: !power, tomorrow }, () => {

    // Activate extension or reload page in our tab
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, tabs => {

      if (power) {
        // Temporarily turn off extension
        chrome.runtime.sendMessage('tempTurnOff');
      }

      // Sends message to our content script
      chrome.tabs.sendMessage(tabs[0].id, !power ? 'run' : 'refresh');
    });

    update();
  });
};

update();

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  request === 'run' && update();
});

chrome.storage.sync.get(null, data => { !data.on && chrome.runtime.sendMessage('tempTurnOff') });