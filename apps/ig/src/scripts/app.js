import Data from './data.js';
import GUI from './gui.js';
//import Routing from './routing.js'

// Create instances of Data and GUI classes
const data = new Data();
const gui = new GUI(data);

(async () => {
  // Initialize the GUI (which will wait for data to load)
  await gui.init();

  console.log("GUI fully initialized!");
})();
