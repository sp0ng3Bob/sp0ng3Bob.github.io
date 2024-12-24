document.addEventListener('DOMContentLoaded', async () => {
  const tabContent = document.getElementById('tabContent');
  const printButton = document.getElementById('print-svg');
  const clearAllButton = document.getElementById('clear-all');

  // Update SVG list grouped by tabs
  const updateSvgList = async () => {
    const svgs = await chrome.runtime.sendMessage({ type: 'GET_SVGS' });
    tabContent.innerHTML = '';
    
    // Group SVGs by tab
    svgs.forEach(([tabId, tabSvgs]) => {
      if (tabSvgs.size === 0) return;
      
      // Get first SVG to access tab URL
      const firstSvg = tabSvgs[0].value;
      const tabUrl = firstSvg.tabUrl;
      
      // Create section for this tab
      const tabSection = document.createElement('div');
      tabSection.className = 'tab-section';
      
      // Add tab URL
      const urlDiv = document.createElement('div');
      urlDiv.className = 'tab-url';
      urlDiv.textContent = tabUrl;
      tabSection.appendChild(urlDiv);
      
      // Create list for SVGs
      const ul = document.createElement('ul');
      
      // Add SVGs for this tab
      Array.from(tabSvgs.entries()).forEach(([url, svgData]) => {
        const li = document.createElement('li');
        const fileName = url.split('/').pop().split('?')[0];
        
        li.innerHTML = `
          <span>${fileName}</span>
          <div class="button-group">
            <button onclick="downloadSvg(${tabId}, '${url}', '${fileName}')">Download</button>
            <button onclick="openSvgInTab(${tabId}, '${url}')">Print Preview</button>
          </div>
        `;
        ul.appendChild(li);
      });
      
      tabSection.appendChild(ul);
      
      // Add control buttons for this tab
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'button-group';
      
      const printTabButton = document.createElement('button');
      printTabButton.textContent = 'Print All in Tab';
      printTabButton.onclick = () => printAllInTab(tabId, tabSvgs);
      buttonGroup.appendChild(printTabButton);
      
      const clearButton = document.createElement('button');
      clearButton.textContent = 'Clear Tab';
      clearButton.onclick = () => clearTab(tabId);
      buttonGroup.appendChild(clearButton);
      
      tabSection.appendChild(buttonGroup);
      
      tabContent.appendChild(tabSection);
    });
  };

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SVG_UPDATED' || message.type === 'TAB_UPDATED') {
      updateSvgList();
    }
  });

  // Clear all SVGs
  clearAllButton.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'CLEAR_ALL' });
    updateSvgList();
  });

  // Clear specific tab
  window.clearTab = async (tabId) => {
    await chrome.runtime.sendMessage({ type: 'CLEAR_TAB', tabId });
    updateSvgList();
  };

  // Print all SVGs
  printButton.addEventListener('click', async () => {
    const svgs = await chrome.runtime.sendMessage({ type: 'GET_SVGS' });
    for (const [tabId, tabSvgs] of svgs) {
      for (const [url, svgData] of tabSvgs) {
        await openSvgInTab(tabId, url);
        // Add a small delay between openings to prevent browser throttling
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  });

  // Initial load
  updateSvgList();
});

// Download helper function
function downloadSvg(tabId, url, fileName) {
  chrome.runtime.sendMessage({ type: 'GET_SVGS' }, (svgs) => {
    const tabMap = new Map(svgs);
    const svgData = tabMap.get(tabId)?.get(url);
    
    if (svgData?.content) {
      const blob = new Blob([svgData.content], { type: 'image/svg+xml' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }
  });
}

// Open SVG in new tab for printing
window.openSvgInTab = async (tabId, url) => {
  const svgs = await chrome.runtime.sendMessage({ type: 'GET_SVGS' });
  const tabMap = new Map(svgs);
  const svgData = tabMap.get(tabId)?.get(url);
  
  if (svgData?.content) {
    const blob = new Blob([svgData.content], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Open in new tab with print-friendly styling
    const printTab = window.open(blobUrl);
    if (printTab) {
      printTab.onload = () => {
        // Add print styles
        const style = printTab.document.createElement('style');
        style.textContent = `
          @media print {
            body { margin: 0; }
            svg { width: 100%; height: auto; }
          }
        `;
        printTab.document.head.appendChild(style);
      };
    }
  }
};

// Print all SVGs in a tab
window.printAllInTab = async (tabId, tabSvgs) => {
  for (const [url] of tabSvgs) {
    await openSvgInTab(tabId, url);
    // Add a small delay between openings to prevent browser throttling
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};