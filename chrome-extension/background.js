chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'transferText') {
        // Handle any necessary actions related to the 'transferText' message if needed
        chrome.storage.local.set({ transferredText: request.text }, () => {
            // You can remove or update this line if it’s not needed anymore
            sendResponse({ status: 'Text saved' });
        });
    }
    return true; // Required for async sendResponse
});

// Additional code for handling commands if necessary
chrome.runtime.onInstalled.addListener(() => {
    console.log("EZRead extension installed and background script running.");
});
