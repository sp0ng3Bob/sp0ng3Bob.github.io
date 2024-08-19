import { styles } from "./styles.js"
import { dialogTemplate } from "./templates.js"
import { injectCSS } from "./utils.js"

class FloatingButton {
  constructor(options = {}) {
    this.options = {
      label: options.label || "Settings",
      position: options.position || "bottom-right",
      color: options.color || "#007bff",
      textColor: options.textColor || "#fff",
    }

    this.injectCSS()
    this.createButton()
    this.createDialog()
    this.addEventListeners()
  }

  injectCSS() {
    const css = styles(this.options)
    injectCSS(css)
  }

  createButton() {
    this.button = document.createElement("button")
    this.button.innerText = "" //this.options.label
    this.button.classList.add("floating-button")
    this.button.classList.add("minimized")
    document.body.appendChild(this.button)
  }

  createDialog() {
    this.dialog = document.createElement("div")
    this.dialog.classList.add("floating-dialog")
    this.dialog.innerHTML = dialogTemplate
    document.body.appendChild(this.dialog)
  }

  addEventListeners() {
    this.button.addEventListener("click", () => {
      this.toggleFloatingButtonText()
      this.toggleDialog()
    })

    document.querySelector("#theme-mode").addEventListener("change", (event) => {
      this.toggleTheme(event.target.value)
    })

    document.querySelector("#font-size").addEventListener("input", (event) => {
      this.updateFontSize(event.target.value)
    })

    document.querySelector("#background-color").addEventListener("input", (event) => {
      this.updateBackgroundColor(event.target.value)
    })
  }
  
  toggleFloatingButtonText() {
    this.button.classList.toggle("minimized")
    this.button.innerText = this.button.innerText ? "" : this.options.label
  }

  toggleDialog() {
    this.dialog.classList.toggle("open")
  }

  toggleTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  updateFontSize(size) {
    document.body.style.fontSize = `${size}px`
  }

  updateBackgroundColor(color) {
    document.body.style.backgroundColor = color
  }
}

export default FloatingButton