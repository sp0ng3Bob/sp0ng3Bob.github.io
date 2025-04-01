import { Data } from './data.js'
import { GUI } from './gui.js'
import { Router } from './router.js'

const data = new Data()
const gui = new GUI(data); // if there is no semicolon the app crashes... if no semicolon then js reads the code like this: const gui = new GUI(data)(async () => { ... })() -- But GUI is a class, not a function, so it throws the error: "(intermediate value) is not a function"

(async () => {
  await gui.init()

  const router = new Router(gui)
  window.router = router
})()
