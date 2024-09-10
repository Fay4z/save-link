document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveLink");
  const groupInput = document.getElementById("groupName");
  const savedLinksDiv = document.getElementById("savedLinks");

  saveButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      const group = groupInput.value || "Uncategorized";

      chrome.storage.sync.get({ links: {} }, function (data) {
        if (!data.links[group]) {
          data.links[group] = [];
        }
        data.links[group].push(url);
        chrome.storage.sync.set({ links: data.links }, function () {
          displayLinks();
        });
      });
    });
  });

  function displayLinks() {
    chrome.storage.sync.get({ links: {} }, function (data) {
      savedLinksDiv.innerHTML = "";
      for (let group in data.links) {
        const groupDiv = document.createElement("div");
        groupDiv.innerHTML = `<h3>${group}</h3>`;
        data.links[group].forEach((url) => {
          groupDiv.innerHTML += `<a href="${url}" target="_blank">${url}</a><br>`;
        });
        savedLinksDiv.appendChild(groupDiv);
      }
    });
  }

  displayLinks();
});
