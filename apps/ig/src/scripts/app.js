import { Data } from './data.js'
import { GUI } from './gui.js'
import { Router } from './router.js'

//const navigation = document.querySelector("#navigation")
//const hideNavButton = document.querySelector("#hideNavigation")



// Create instances of Data and GUI classes
const data = new Data()
const gui = new GUI(data); // if there is no semicolon the app crashes... if no semicolon then js reads the code like this: const gui = new GUI(data)(async () => { ... })() -- But GUI is a class, not a function, so it throws the error: "(intermediate value) is not a function"

(async () => {
  // Initialize the GUI (which will wait for data to load)
  await gui.init()

  /* ROUTING */
  const router = new Router(gui)

  console.log("GUI fully initialized!")
})()

/* hideNavButton.addEventListener("click", () => {
  navigation.classList.remove("active")
  navigation.blur()
}) */
