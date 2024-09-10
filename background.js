chrome.action.onClicked.addListener(function (tab) {
  chrome.action.setPopup({ popup: "popup.html" });
});
