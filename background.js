'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ on: true }, function () { });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'www.youtube.com' },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    if (request === "tempTurnOff") {
        let intervalID;
        const turnOnAppWhenReady = () => {
            chrome.storage.sync.get(null, (data) => {
                const turnOnTime = new Date(data.tomorrow);
                if (Date.now() > turnOnTime) {
                    chrome.storage.sync.set({ on: true }, () => {
                        // send message to popup
                        chrome.runtime.sendMessage('run');
                        // send message to conten script
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            chrome.tabs.sendMessage(tabs[0].id, "run")
                        });
                        clearInterval(intervalID);
                    });
                }
            });
        };

        intervalID = setInterval(turnOnAppWhenReady, 1000);
    }
    callback();
});

chrome.runtime.sendMessage('tempTurnOff');