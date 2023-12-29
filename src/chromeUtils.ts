export function getActiveTabUrl() : Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      // @ts-ignore
      if (chrome.runtime.lastError) {
        // Handle the error by rejecting the promise with -1
        reject(null);
      } else {
        let url = tabs[0] ? tabs[0].url : null;
        resolve(url);
      }
    });
  });
}
