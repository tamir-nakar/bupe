export function getActiveTabUrl() : Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        // Handle the error by rejecting the promise with -1
        reject(null);
      } else {
        let url = tabs[0] && tabs[0].url ? tabs[0].url : '';
        resolve(url);
      }
    });
  });
}
