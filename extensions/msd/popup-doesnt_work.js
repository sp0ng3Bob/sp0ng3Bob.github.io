document.getElementById('print-svg').addEventListener('click', async () => {
  console.log("Print button clicked. Preparing to inject script...");
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      console.warn("No active tab found.");
      return;
    }

    console.log("Active tab found:", tab);

    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },  // Inject script in all frames
      func: async () => {
        console.log("Script injection successful. Executing functions...");

        // getAllPictures function
        async function getAllPictures(firstImg) {
          console.log("getAllPictures called with firstImg:", firstImg);
          const out = []; // Array to store img DOM elements
          let scoreIndex = 0; // Starting index for fetching images
          let maxImages = 50; // Max number of images to fetch

          while (scoreIndex < maxImages) {
            const currentUrl = firstImg.replace(/score_\d+\.svg$/, `score_${scoreIndex}.svg`);
            console.log(`Attempting to fetch image at: ${currentUrl}`);

            try {
              // Create a new img element
              const img = new Image();
              img.src = currentUrl;

              // Wait for the image to load
              await new Promise((resolve, reject) => {
                img.onload = () => {
                  console.log(`Image loaded successfully: ${currentUrl}`);
                  resolve();
                };
                img.onerror = (error) => {
                  console.warn(`Image failed to load: ${currentUrl}`, error);
                  reject(error);
                  maxImages = scoreIndex; // Stop after the error
                };
              });

              // If successfully loaded, add the img element to the output array
              out.push(img);
            } catch (error) {
              console.warn(`Error loading image: ${currentUrl}`, error);
              break;
            }

            scoreIndex++;
          }

          console.log(`Finished fetching images. Total images fetched: ${out.length}`);
          return out;
        }

        // extractAndPrintSVGs function
        async function extractAndPrintSVGs() {
          console.log("extractAndPrintSVGs function invoked");

          const main = document.querySelector('main');
          const content = main.querySelector('#jmuse-scroller-component');
          
          if (!content) {
            console.warn("SVG container (#jmuse-scroller-component) not found.");
            alert('SVG container not found.');
            return;
          }

          const firstImage = content.querySelector('img');
          if (!firstImage) {
            console.warn("No images found inside #jmuse-scroller-component.");
            alert('No images found on this page.');
            return;
          }

          const firstURL = firstImage.getAttribute('src').split('?')[0];
          console.log("First image found with src:", firstURL);

          const svgs = await getAllPictures(firstURL);

          if (svgs.length === 0) {
            console.warn("No SVGs were fetched.");
            alert('No SVGs found.');
            return;
          }

          console.log(`Preparing to print ${svgs.length} SVG(s).`);

          // Create a new printable document
          const printWindow = window.open('', '_blank');
          const printDocument = printWindow.document;

          printDocument.write('<html><head><title>Print Music Scores</title></head><body>');

          svgs.forEach((img, index) => {
            console.log(`Adding image ${index + 1} to printable document.`);

            const imgContainer = document.createElement('div');
            imgContainer.style.margin = '0';
            imgContainer.style.padding = '0';
            imgContainer.style.height = '100vh';
            imgContainer.style.display = 'flex';
            imgContainer.style.justifyContent = 'center';
            imgContainer.style.alignItems = 'center';
            imgContainer.appendChild(img);

            img.style.height = '100%';
            img.style.width = 'auto';

            printDocument.body.appendChild(imgContainer);
          });

          printDocument.write('</body></html>');
          printDocument.close();

          console.log("Opening print dialog...");
          printWindow.focus();
          printWindow.print();
          printWindow.close();
          console.log("Print process complete.");
        }

        // Run the extractAndPrintSVGs function
        await extractAndPrintSVGs();
      },
      world: "MAIN"  // Ensure it's injected into the main world (page's DOM)
    });

    console.log("Script injection successful.");
  } catch (error) {
    console.warn("Error injecting script:", error);
  }
});
