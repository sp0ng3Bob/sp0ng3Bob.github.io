class Router {
  constructor(gui) {
    //this.routes = {};
    this.gui = gui
    this.init();
  }

  // Method to register routes
/*   register(route, callback) {
    this.routes[route] = callback;
  } */

  // Method to navigate to a specific route
  navigate(route) {
    if (+route > 1753 || +route < 0) {
      route = '0'
    }
    this.gui.populateForIndex(route)
    this.updateURL(route);
  }

  // Update the URL with the new route
  updateURL(route) {
    const url = new URL(window.location);
    url.searchParams.set('goba', route);
    window.history.pushState({ route }, '', url);
  }

  // Initialize the router
  init() {
    const url = new URL(window.location);
    const goba = url.searchParams.get('goba') || '0';
    this.updateURL(goba); // Set initial URL to ?goba=0 if not present

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
      const route = e.state ? e.state.route : '0';
      this.navigate(route);
    });

    // Navigate to the initial route
    this.navigate(goba);
  }
}

export default Router
