'use strict';

// Changes made to youtube
const applyChanges = (parent) => {

  // dont edit when on a channel page
  if (window.location.href.match("channel|user") !== null) return;

  // cache parent query
  const $parent = $(parent);

  // Replace list of video titles and title when watching
  const changeText = (index, element) => element.innerText = 'The Walrus Protects';
  $parent.find('a#video-title, span#video-title').each(changeText);

  // Completely remove metadata on home page
  $parent.find('#metadata-container').remove();

  // Completely remove metadata on watch page
  $parent.find('a.ytd-compact-video-renderer').remove();

  // Remove "LIVE NOW" and "NEW" badges
  $parent.find('ytd-badge-supported-renderer').remove();

  // Change thumbnail into warning
  const walrusThumbnail = chrome.runtime.getURL('images/walrusThumbnail.png');
  const changeImage = (index, element) => element.src = walrusThumbnail;
  $parent.find('a#thumbnail img#img').each(changeImage);

  // Change thumbnails in video suggestions
  const changePreview = (index, element) => element.style = `background-image: url("${walrusThumbnail}")`;
  $parent.find('.ytp-videowall-still-image').each(changePreview);

  // fix thumbnails that went black
  const changeClass = (index, element) => element.classList.remove('empty');
  $parent.find('.no-transition.empty').each(changeClass);
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
    .observe(document.body, { subtree: true, childList: true, characterData: true });
};

// Listen to if the extension is turned on or off
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  request === 'run' && runWalrus();
  request === 'refresh' && location.reload();
});

// Makes the changes if the extension is turned on 
chrome.storage.sync.get('on', data => { data.on && runWalrus() });