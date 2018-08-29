'use strict';

// Changes made to youtube
const applyChanges = (parent) => {
  // Replace list of video titles and title when watching
  const changeText = (index, element) => element.innerText = 'Walrus';
  $(parent).find('a#video-title, span#video-title').each(changeText);

  // Change thumbnail into warning
  const changeImage = (index, element) => element.src = chrome.runtime.getURL('images/walrusThumbnail.png');
  $(parent).find('a#thumbnail img#img').each(changeImage);

  // fix thumbnails that went black
  const changeClass = (index, element) => element.classList.remove('empty');
  $(parent).find('.style-scope.ytd-thumbnail.no-transition.empty').each(changeClass);
};

// Handle changes to the site
const handleMutations = mutations => {
  // If the mutation adds videos, apply the changes again 
  mutations
    .filter(mutation => mutation.type === 'childList')
    .forEach(mutation => {
      mutation.addedNodes
        .forEach(node => {
          // Example nodenames: YTD-ITEM-SECTION-RENDERER YTD-ITEM-SECTION-RENDERER YTD-ITEM-SECTION-RENDERER
          // For the sake of my sanity, I dont enumerate them all
          // Longer nodenames ususally indicate more important updates
          node.nodeName.length > 20 && applyChanges(document.body)
        })
    });
}

// Runs the changes and starts watching the site for any new videos 
const runWalrus = () => {
  applyChanges(document.body);
  new MutationObserver(handleMutations)
    .observe(document.body, { subtree: true, childList: true, characterData: true});
};

// Listen to if the extension is turned on or off
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  request === 'run' && runWalrus();
  request === 'refresh' && location.reload();
});

// Makes the changes if the extension is turned on 
chrome.storage.sync.get('on', data => { data.on && runWalrus() });