import Data from './data.js';
import GUI from './gui.js';
//import Routing from './routing.js'

const navigation = document.querySelector("#navigation")
const hideNavButton = document.querySelector("#hideNavigation")

// Create instances of Data and GUI classes
const data = new Data();
const gui = new GUI(data);

(async () => {
  // Initialize the GUI (which will wait for data to load)
  await gui.init();

  console.log("GUI fully initialized!");
})();

/* hideNavButton.addEventListener("click", () => {
  navigation.classList.remove("active");
  navigation.blur();
}) */
