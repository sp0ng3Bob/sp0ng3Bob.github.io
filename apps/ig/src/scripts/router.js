export class Router {
  constructor(gui) {
    this.gui = gui
    
    this.DOMNoContents = document.querySelector("#noContent")
    this.DOMContents = document.querySelector("#content")
    
    this.init()
  }

  // Method to navigate to a specific route
  navigate(route) {
    if (route === null || route === undefined || route === "" || +route > 1753 || +route < 0) {
      this.showNoContent()
    } else {
      this.gui.populateForIndex(route)
      this.showContent()
    }
    
    this.updateURL(route)
  }

  // Update the URL with the new route
  updateURL(route) {
    const url = new URL(window.location)
    
    if (route === null || route === undefined || route === "") {
      url.searchParams.delete("goba") // Ensure clean URL when returning to home
    } else {
      url.searchParams.set("goba", route)
    }

    window.history.pushState({ route }, "", url)
  }

  // Initialize the router
  init() {
    const url = new URL(window.location)
    const goba = url.searchParams.get("goba")

    if (!goba || +goba < 0 || +goba > 1753) {
      this.showNoContent()
    } else {
      this.showContent()
      this.gui.populateForIndex(goba)
    }

    // Handle browser back/forward navigation
    window.addEventListener("popstate", (e) => {
      const route = e.state ? e.state.route : "0"
      this.navigate(route)
    })
  }

  showNoContent() {
    this.DOMNoContents.classList.remove("hidden")
    this.DOMContents.classList.add("hidden")
  }

  showContent() {
    this.DOMNoContents.classList.add("hidden")
    this.DOMContents.classList.remove("hidden")
  }
}

//export default Router
