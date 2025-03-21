export class GUI {
  constructor(dataInstance) {
    this.data = dataInstance // Reference to the Data class instance
    this.nameDiv = document.querySelector("#name") // DOM element for names
    this.rodDiv = document.querySelector("#rod") // DOM element for names
    this.gallery = document.querySelector("#gallery")
    this.quickInfo = document.querySelector("#quick-info")
    this.markers = this.quickInfo.querySelectorAll(".marker")
    this.infoCard = document.querySelector("#right")
    this.additionalInfo = document.querySelector("#additional")
    this.slideIndex = 1
    
    document.querySelector("#gallery-plus").addEventListener("click", () => this.plusDivs(1))
    document.querySelector("#gallery-minus").addEventListener("click", () => this.plusDivs(-1))
  }

  async init() {
    // Wait for the data to load
    await this.data.init()
  }
  
  // https://www.w3schools.com/w3css/w3css_slideshow.asp
  plusDivs(n) {
    this.slideIndex += n
    this.showDivs()
  }

  showDivs() {
    const x = document.querySelectorAll(".gallery-wrapper")
    if (this.slideIndex > x.length) { this.slideIndex = 1 }
    if (this.slideIndex < 1) { this.slideIndex = x.length }
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("active")
    }
    x[this.slideIndex-1].classList.add("active")
  }
  
  populateForIndex(id) {
    const goba = this.data.goba(id)
    this.populateNames(goba)
    this.populateTooltips(goba)
    this.populateGallery(goba)
    this.populateInfoCard(goba)
    this.populateSecondaryInfo(goba)
  }
  
  poulateInfoClasses(goba, list) {
    let title, content, data
    
    for (let info of list) {
      info.classList.remove("hidden")
      if (!info.id) {
        title = info.children[0]
        content = info.children[1]
        data = goba.data[`${title.innerText.toLowerCase()}`]
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
            data = goba.data["podobneVrste"]
            if (!data) {
              info.classList.add("hidden")
            } else {
              info.classList.remove("hidden")
              content = info.children[1]
              content.innerHTML = data
            }
            break
          case "synonyms":
            data = goba.data["sinonimi"]
            
            if (!data) {
              info.classList.add("hidden")
            } else {
              info.classList.remove("hidden")
              content = info.children[1]
              content.innerHTML = ""
              for (const syn of data) {
                content.innerHTML += `<span class="synonym-card">${syn}</span>`
              }              
            }
            break
          case "usefulness":
            data = goba.data["uporabnost"]
            
            if (!data) {
              info.classList.add("hidden")
            } else {
              info.classList.remove("hidden")
              content = info.children[1]
              content.innerHTML = data      
            }
            break          
          case "other-names":
            data = goba["domačeIme"]
            
            if (data == "/") {
              info.classList.add("hidden")
            } else {
              info.classList.remove("hidden")
              content = info.children[1]
              content.innerHTML = ""
              for (const name of data) {
                content.innerHTML += `<span class="quick-card">${name}</span>`
              }   
            }
            break
        }
      }
    }
  }

  populateNames(goba) {
    this.nameDiv.children[0].innerHTML = goba.sloIme + `<a href="${goba.url}" target="_blank">↝</a>` || "No data available";
    this.nameDiv.children[1].innerText = goba.data.rod.lat || "No data available";
    this.rodDiv.children[1].innerHTML = goba.data.rod.slo + `<a href="${goba.data.rodUrl}" target="_blank">↝</a>`
  }
  
  populateGallery(goba) {
    this.gallery.innerHTML = ""
    for (const image of goba.data.galerija.slike) {
      // <div class="gallery-wrapper" data-author="Jože Z'doline">
      //   <img class="gallery" src="https://www.gobe.si/slike/Abortiporus_biennis.jpg">
      // </div>
      const div = document.createElement("div")
      div.classList.add("gallery-wrapper")
      div.setAttribute("data-author", "Avtor: " + image.avtor || "")
      
      const img = document.createElement("img")
      img.classList.add("gallery")
      img.setAttribute("src", image.url)
      
      div.appendChild(img)
      this.gallery.appendChild(div)
    }
    //this.gallery.src = goba.data.slikaUrl
    this.showDivs()
  }
  
  populateTooltips(goba) {
    const freq = this.markers[3]
    freq.children[1].innerText = goba["pogostost"]
    
    const protect = this.markers[1]
    //protect.children[0].setAttribute("src", "https://www.gobe.si/pub/ikone/protozoa.png")
    protect.children[1].innerText = "protect"
    
    const redList = this.markers[2]
    //redList.children[0].setAttribute("src", "https://www.gobe.si/pub/ikone/lisaj.png")
    if (goba["naRdečemSeznamu"] == "DA") {
      const redListData = this.data.rdeciSeznam()
      const category = redListData["seznam"][goba.url]
      redList.children[1].innerHTML = `${redListData['iucn']['naslov']}<br>${redListData['iucn']['kategorije'][category]}`
    } else {
      // not on red listing
    }
    
    const edible = this.markers[0]
    edible.children[0].classList.remove(...edible.children[0].classList)
    if (goba["užitna"] == "užitna") {
      edible.children[0].classList.add("edible-green")
    } else if (goba["užitna"] == "pogojno užitna") {
      edible.children[0].classList.add("edible-yellow")
    } else {
      edible.children[0].classList.add("edible-red")
    }
    edible.children[1].innerText = goba["užitna"]
  }
  
  populateInfoCard(goba) {
    this.poulateInfoClasses(goba, this.infoCard.querySelectorAll(".info"))
  }
  
  populateSecondaryInfo(goba) {
    this.poulateInfoClasses(goba, this.additionalInfo.querySelectorAll(".info"))
  }
}

//export default GUI
