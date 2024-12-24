// Store SVGs by tab ID
let svgCache = new Map();

// Log when background script starts
console.log('Musescore SVG Downloader: Background script started');

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  svgCache.delete(tabId);
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    svgCache.delete(tabId);
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message.type); // Debug logging

  if (message.type === 'SVG_INTERCEPTED' && sender.tab) {
    const tabId = sender.tab.id;
    console.log('Intercepted SVG for tab:', tabId); // Debug logging
    
    if (!svgCache.has(tabId)) {
      svgCache.set(tabId, new Map());
    }
    
    svgCache.get(tabId).set(message.url, {
      content: message.content,
      tabUrl: sender.tab.url
    });
    
    // Notify popup
    chrome.runtime.sendMessage({
      type: 'SVG_UPDATED',
      svgs: Array.from(svgCache.entries())
    });
  } else if (message.type === 'GET_SVGS') {
    console.log('Sending SVGs:', Array.from(svgCache.entries())); // Debug logging
    sendResponse(Array.from(svgCache.entries()));
  } else if (message.type === 'CLEAR_ALL') {
    svgCache.clear();
    sendResponse({ success: true });
  } else if (message.type === 'CLEAR_TAB') {
    svgCache.delete(message.tabId);
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open
});