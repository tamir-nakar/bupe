chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "updateUrl") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;
  
          // Execute a content script to change the URL using pushState
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: (value) => {
                window.history.replaceState(null, 'unused', value);
            },
            args: [request.value],
          });
        }
      });
    }
  });
  