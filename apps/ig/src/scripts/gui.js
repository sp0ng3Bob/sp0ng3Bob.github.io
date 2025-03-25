export class GUI {
  constructor(dataInstance) {
    this.data = dataInstance // Reference to the Data class instance
    
    // Navigacija
    this.navigation = document.querySelector("#navigation")
    this.showNavButton = document.querySelector("#showNavigation")
    this.hideNavButton = document.querySelector("#hideNavigation")
    this.aboutDialog = document.querySelector("#aboutDialog")
    this.closeDialogButton = document.querySelector("#closeAboutDialog")
    this.filterInputs = document.querySelectorAll(".filter input[type='checkbox']");
    this.collapsibleFilters = document.querySelector("#filters .collapsible")
    this.list = document.querySelector("#list ul")
    this.search = document.querySelector("input[type='search']")

    // Goba
    this.nameDiv = document.querySelector("#name")
    this.rodDiv = document.querySelector("#rod")
    this.gallery = document.querySelector("#gallery")
    this.quickInfo = document.querySelector("#quick-info")
    this.markers = this.quickInfo.querySelectorAll(".marker")
    this.infoCard = document.querySelector("#right")
    this.additionalInfo = document.querySelector("#additional")
    this.slideIndex = 1
    
    this.setListeners()
  }
  
  updateLabelState(input) {
    const label = input.parentElement
    if (input.checked) {
      label.classList.add("checked")
    } else {
      label.classList.remove("checked")
    }
  }
  
  setListeners() {
    // Galerija
    document.querySelector("#gallery-plus").addEventListener("click", () => this.plusDivs(1))
    document.querySelector("#gallery-minus").addEventListener("click", () => this.plusDivs(-1))
    
    // Navigacija
    this.showNavButton.addEventListener("click", () => {
      this.navigation.classList.add("active")
      this.hideNavButton.classList.toggle("hidden")
    })
    
    this.hideNavButton.addEventListener("click", () => {
      this.navigation.classList.remove("active")
      this.hideNavButton.classList.toggle("hidden")
    })
    
    this.closeDialogButton.addEventListener("click", () => this.aboutDialog.close())
    
    document.addEventListener("click", (event) =>  {
      if (!this.navigation.contains(event.target) && event.target !== this.showNavButton) {
        this.navigation.classList.remove("active")
        this.hideNavButton.classList.toggle("hidden")
      }
    })
    
    this.filterInputs.forEach(input => {
      //this.updateLabelState(input)
      input.addEventListener("change", () => this.updateLabelState(input))
    })
    
    this.collapsibleFilters.addEventListener("click", function() { // (event) => { const element = event.currentTarget; ... }
      this.classList.toggle("active")
      const content = this.parentElement.querySelector(".collapsible-content")
      if (content.style.height == "0px" || content.style.height == "") {
        content.style.display = "block"
        content.style.height = content.scrollHeight + "px" // to trigger the animation
        content.style.height = "auto"
      } else {
        content.style.display = "none"
        content.style.height = "0px"
      }
    })
    
    // Searching & filters
    this.search.addEventListener("input", () => this.updateMushroomList())
    this.filterInputs.forEach((filter) => {
      filter.addEventListener("change", () => this.updateMushroomList())
    })
  }

  async init() {
    // Wait for the data to load
    await this.data.init()
    this.populateMushroomList()
  }
  
  populateMushroomList() {
    const tmpList = []
    
    for (const goba of this.data.seznam()) {
      const li = document.createElement("li")
      li.classList.add("mushroom-list-item")
      li.innerHTML = `<button onclick="router.navigate(${goba.id})">${goba.sloIme}, ${goba.latIme}, ${goba.pogostost}, ${goba.zavarovana}, ${goba.naRdečemSeznamu}</button>`
      tmpList.push(li)
    }
    
    const li = document.createElement("li")
    li.classList.add("mushroom-list-item")
    li.innerText = `${tmpList.length} ${this.getSlovenianSuffix(tmpList.length)}`
    this.list.appendChild(li)
    
    this.list.append(...tmpList)
  }
  
  updateMushroomList() {
    const tmpList = []
    this.list.innerHTML = ""
    
    for (const goba of this.data.seznam()) {
      if (this.listQueryAndFilterCheck(goba)) {
        const li = document.createElement("li")
        li.classList.add("mushroom-list-item")
        li.innerHTML = `<button onclick="router.navigate(${goba.id})">${goba.sloIme}, ${goba.latIme}, ${goba.pogostost}, ${goba.zavarovana}, ${goba.naRdečemSeznamu}</button>`
        tmpList.push({ li, goba })        
      }
      //break
    }
    
    if (this.filterInputs[4].checked) {
      tmpList.sort((a, b) => {
        const pogostostA = a.goba.pogostost === "/" ? -Infinity : Number(a.goba.pogostost)
        const pogostostB = b.goba.pogostost === "/" ? -Infinity : Number(b.goba.pogostost)
        
        if (pogostostA !== pogostostB) {
          return pogostostB - pogostostA
        }

        return a.goba.id - b.goba.id
      })
    }
    
    const li = document.createElement("li")
    li.classList.add("mushroom-list-item")
    li.innerText = `${tmpList.length} ${this.getSlovenianSuffix(tmpList.length)}`
    this.list.appendChild(li)
    
    this.list.append(...tmpList.map(entry => entry.li))
  }
  
  listQueryAndFilterCheck(goba) {
    const searchQuery = this.search.value
    const edibility = Array.from({ length: 4 }, (_, i) => this.filterInputs[i].checked)
    const redlist = this.filterInputs[5].checked
    const prot = this.filterInputs[6].checked
    const months = Array.from({ length: 12 }, (_, i) => this.filterInputs[i + 7])
    
    const searchFields = [
      goba?.sloIme, 
      goba?.latIme, 
      goba?.data?.rod?.slo, 
      goba?.data?.rod?.lat, 
      goba?.data?.značilnost, 
      goba?.data?.klobuk, 
      goba?.data?.trosovnica, 
      goba?.data?.bet, 
      goba?.data?.meso, 
      goba?.data?.trosi
    ]

    const matchesSearch = searchFields.some(term => 
      term && term.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const matchesEdibility = edibility.some(input => input === true) ?
      (edibility[0] && this.data.uzitne().seznam.includes(goba.url)) || 
      (edibility[1] && this.data.pogojnoUzitne().seznam.includes(goba.url)) || 
      (edibility[2] && this.data.strupene().seznam.some(obj => obj.seznam.includes(goba.url))) || 
      (edibility[3] && 
        !this.data.uzitne().seznam.includes(goba.url) && 
        !this.data.pogojnoUzitne().seznam.includes(goba.url) && 
        !this.data.strupene().seznam.some(obj => obj.seznam.includes(goba.url))
      ) : true
      

    const matchesRedList = redlist ? Object.keys(this.data.rdeciSeznam().seznam).includes(goba.url) : true
    const matchesProtected = prot ? Object.keys(this.data.zavarovane().seznam).includes(goba.url) : true
    
    const matchesGrowthMonths = true /* months.some(i => i.checked) && goba?.data?.časRasti?.length > 0 ? 
      months.some(input => goba.data.časRasti.some(month => input.checked && month.toLowerCase().includes(input.value))
    ) : true */

    if (matchesSearch && 
        matchesEdibility && 
        matchesRedList && 
        matchesProtected && 
        matchesGrowthMonths) {
      return true
    }
    return false
  }
  
  getSlovenianSuffix(count) {
    if (count == 1) {
      return "takšna goba.";
    } else if (count == 2) {
      return "takšni gobi.";
    } else if (count > 2 && count < 5) {
      return "takšne gobe.";
    } else {
      return "takšnih gob.";
    }
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
    //protect.children[1].classList
    protect.children[1].innerText = `Zavarovana goba: ${goba.zavarovana}`
    
    const redList = this.markers[2]
    //redList.children[0].setAttribute("src", "https://www.gobe.si/pub/ikone/lisaj.png")
    if (goba["naRdečemSeznamu"] == "DA") {
      const redListData = this.data.rdeciSeznam()
      const category = redListData["seznam"][goba.url]
      redList.children[1].innerHTML = `${redListData['iucn']['naslov']}<br>${redListData['iucn']['kategorije'][category]}`
    } else {
      redList.children[1].innerText = "Na rdečem seznamu: NE"
    }
    
    const edible = this.markers[0]
    edible.children[0].classList.remove(...edible.children[0].classList)
    if (this.data.uzitne().seznam.includes(goba.url)) {
      edible.children[0].classList.add("edible-green")
      edible.children[1].innerText = "Užitna"
    } else if (this.data.pogojnoUzitne().seznam.includes(goba.url)) {
      edible.children[0].classList.add("edible-yellow")
      edible.children[1].innerText = "Pogojno užitna"
    } else if (this.data.strupene().seznam.some(obj => obj.seznam.includes(goba.url))) {
      edible.children[0].classList.add("edible-red")
      edible.children[1].innerText = "Strupena"
    } else {
      edible.children[0].classList.add("edible-red")
      edible.children[1].innerText = "Neznano"
    }
  }
  
  populateInfoCard(goba) {
    this.poulateInfoClasses(goba, this.infoCard.querySelectorAll(".info"))
  }
  
  populateSecondaryInfo(goba) {
    this.poulateInfoClasses(goba, this.additionalInfo.querySelectorAll(".info"))
  }
}

//export default GUI