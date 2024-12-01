class GUI {
  constructor(dataInstance) {
    this.data = dataInstance; // Reference to the Data class instance
    this.nameDiv = document.querySelector("#name"); // DOM element for names
    this.rodDiv = document.querySelector("#rod"); // DOM element for names
    this.image = document.querySelector("#image");
    this.infoCard = document.querySelector("#right")
    this.additionalInfo = document.querySelector("#additional")
  }

  async init() {
    // Wait for the data to load
    await this.data.init();

    // Populate the UI after the data is loaded
    const indexGobe = 0
    const goba = this.data.goba(indexGobe);
    this.populateNames(goba);
    this.populateInfoCard(goba)
    this.populateSecondaryInfo(goba)
  }
  
  populateForIndex(id) {
    const goba = this.data.goba(id)
    this.populateNames(goba)
    this.populateInfoCard(goba)
    this.populateSecondaryInfo(goba)
  }
  
  poulateInfoClasses(goba, list) {
    let title, content
    
    for (let info of list) {
      info.classList.remove("hidden")
      if (!info.id) {
        title = info.children[0]
        content = info.children[1]
        const data = goba.data[`${title.innerText.toLowerCase()}`]
        if (!data) {
          info.classList.add("hidden")
        }
        content.innerText = data || "/"
      } else {
        switch(info.id) {
          case "growing":
            const meseci = goba.data["časRasti"]
            for (let monthDiv of info.children[1].children) {
              monthDiv.classList.remove("growing")
              if (meseci.includes(monthDiv.dataset.month)) {
                monthDiv.classList.add("growing")
              }            
            }
            break
          case "lookalikes":
            const data = goba.data["podobneVrste"]
            if (!data) {
              info.classList.add("hidden")
            }
            break
        }
      }
    }
  }

  populateNames(goba) {
    //icon for edibility or what this.nameDiv.previousElementSibling
    this.nameDiv.children[0].innerText = goba.sloIme || "No data available";
    this.nameDiv.children[1].innerText = goba.data.rod.lat || "No data available";
    this.rodDiv.children[1].innerText = goba.data.rod.slo
    //this.rodDiv.children[2] // toltip
    
    this.image.src = goba.data.slikaUrl
  }
  
  populateInfoCard(goba) {
    this.poulateInfoClasses(goba, this.infoCard.querySelectorAll(".info"))
  }
  
  populateSecondaryInfo(goba) {
    this.poulateInfoClasses(goba, this.additionalInfo.querySelectorAll(".info"))
  }
}

export default GUI;
