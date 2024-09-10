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
        data.links[group].forEach((url, index) => {
          const linkDiv = document.createElement("div");
          linkDiv.className = "linkItem";
          linkDiv.innerHTML = `
            <button class="deleteButton" data-group="${group}" data-index="${index}">Delete X</button>
            <a class="linkUrl" href="${url}" target="_blank">${url}</a>
          `;
          groupDiv.appendChild(linkDiv);
        });
        savedLinksDiv.appendChild(groupDiv);
      }
      addDeleteListeners();
    });
  }

  function addDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const group = this.getAttribute("data-group");
        const index = parseInt(this.getAttribute("data-index"));
        deleteLink(group, index);
      });
    });
  }

  function deleteLink(group, index) {
    chrome.storage.sync.get({ links: {} }, function (data) {
      if (data.links[group] && data.links[group][index]) {
        data.links[group].splice(index, 1);
        if (data.links[group].length === 0) {
          delete data.links[group];
        }
        chrome.storage.sync.set({ links: data.links }, function () {
          displayLinks();
        });
      }
    });
  }

  displayLinks();

  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", function () {
    window.close();
  });
});
