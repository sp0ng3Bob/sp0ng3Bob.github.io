// First image is always loaded (listen for this kind of request url): https://musescore.com/static/musescore/scoredata/g/05aa9160d7cd7c70d0b17d4add1c0f0ecd790a91/score_0.svg?no-cache=1715703015

// then all other are loaded via api: https://musescore.com/api/jmuse?id=8472479&index=1&type=img --> {error, info: {url}, result, status}
// --> get the other svg from json.info.url and fetch the svg.



// Intercept fetch requests
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(async (entry) => {
    if (entry.initiatorType === 'img' || entry.initiatorType === 'fetch') {
      const url = entry.name;
      if (url.match(/.*\/score_.*\.svg.*/)) { //(musescore\.com|ultimate-guitar\.com)
        try {
          const response = await fetch(url);
          const content = await response.text();
          if (content.includes('<svg')) {
            chrome.runtime.sendMessage({
              type: 'SVG_INTERCEPTED',
              url: url,
              content: content
            });
          }
        } catch (error) {
          console.error('Failed to fetch SVG:', error);
        }
      }
    }
  });
});

observer.observe({ entryTypes: ['resource'] });

// Also monitor DOM for dynamically added SVG images
const domObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeName === 'IMG' || node.nodeName === 'image') {
        const url = node.src || node.href?.baseVal;
        if (url && url.match(/.*\/score_.*\.svg.*/)) {
          fetch(url)
            .then(response => response.text())
            .then(content => {
              if (content.includes('<svg')) {
                chrome.runtime.sendMessage({
                  type: 'SVG_INTERCEPTED',
                  url: url,
                  content: content
                });
              }
            })
            .catch(error => console.error('Failed to fetch SVG:', error));
        }
      }
    });
  });
});

domObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// Log to confirm content script is running
console.log('Musescore SVG Downloader: Content script loaded');