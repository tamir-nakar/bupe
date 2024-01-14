export function getActiveTabUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        // Handle the error by rejecting the promise with -1
        reject(null);
      } else {
        let url = tabs[0] && tabs[0].url ? tabs[0].url : "";
        resolve(url);
      }
    });
  });
}

export function getLocalData(key: string): Promise<any> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      //console.log('Value retrieved from local storage:', result[key]);
      resolve(result[key]);
    });
  });
};

export function setLocalData(data: any): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => {
      //console.log('Data stored successfully in local storage');
      resolve();
    });
  });
};
