export class GUI {
  constructor(dataInstance) {
    this.data = dataInstance // Reference to the Data class instance
    
    // Navigacija
    this.navigation = document.querySelector("#navigation")
    this.showNavButton = document.querySelector("#showNavigation")
    this.hideNavButton = document.querySelector("#hideNavigation")
    this.aboutDialog = document.querySelector("#aboutDialog")
    this.closeDialogButton = document.querySelector("#closeAboutDialog")
    this.openDialogButton = document.querySelector("#openAboutDialog")
    this.filterInputs = document.querySelectorAll(".filter input[type='checkbox']");
    this.collapsibleFilters = document.querySelector("#filters .collapsible")
    this.list = document.querySelector("#list ul")
    this.search = document.querySelector("input[type='search']")
    this.noContentDiv = document.querySelector("#noContent")

    // Goba
    this.nameDiv = document.querySelector("#name")
    this.rodDiv = document.querySelector("#rod")
    this.gallery = document.querySelector("#gallery")
    this.dotsContainer = document.querySelector(".gallery-dots")
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
    
    this.gallery.addEventListener('touchstart', (event) => {
      this.touchstartX = event.changedTouches[0].screenX
      //touchstartY = event.changedTouches[0].screenY
    }, false)

    this.gallery.addEventListener('touchend', (event) => {
      this.touchendX = event.changedTouches[0].screenX
      //touchendY = event.changedTouches[0].screenY
      this.handleSwipeGesture()
    }, false)
    
    // Navigacija
    this.showNavButton.addEventListener("click", () => {
      this.navigation.classList.add("active")
      this.hideNavButton.classList.remove("hidden")
      this.openDialogButton.classList.remove("hidden")
    })
    
    this.handleHideNavButton = () => {
      this.navigation.classList.remove("active")
      this.hideNavButton.classList.add("hidden")
      this.openDialogButton.classList.add("hidden")
    }
    
    this.hideNavButton.addEventListener("click", this.handleHideNavButton)
    
    this.openDialogButton.addEventListener("click", () => {
      this.aboutDialog.show()
      this.navigation.querySelector("div").style.overflow = "hidden"
    })
    this.closeDialogButton.addEventListener("click", () => {
      this.aboutDialog.close()
      this.navigation.querySelector("div").style.overflow = "auto"
    })
    
    document.addEventListener("click", (event) =>  {
      if (!this.navigation.contains(event.target) && event.target !== this.showNavButton) {
        this.navigation.classList.remove("active")
        this.openDialogButton.classList.add("hidden")
        this.hideNavButton.classList.add("hidden")
      }
    })
    
    this.filterInputs.forEach(input => {
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

  handleSwipeGesture() { //https://stackoverflow.com/questions/62823062/adding-a-simple-left-right-swipe-gesture
    if (this.touchendX < this.touchstartX) {
      /* console.log('Swiped Left') */
      this.plusDivs(1)
    }

    if (this.touchendX > this.touchstartX) {
      /* console.log('Swiped Right') */
      this.plusDivs(-1)
    }

/*     if (touchendY < touchstartY) {
      console.log('Swiped Up');
    }

    if (touchendY > touchstartY) {
      console.log('Swiped Down');
    }

    if (touchendY === touchstartY) {
      console.log('Tap');
    } */
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
      li.innerHTML = `<button onclick="router.navigate(${goba.id})"><span>${goba.sloIme}<br><i>${goba.latIme}</i></span><span>${goba.pogostost}, ${goba.zavarovana}, ${goba.naRdečemSeznamu}</span></button>`
      
      li.addEventListener("click", this.handleHideNavButton)
      
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
    
    for (const li of this.list.children) {
      li.removeEventListener("click", this.handleHideNavButton)
    }
    
    this.list.innerHTML = ""
    
    for (const goba of this.data.seznam()) {
      if (this.listQueryAndFilterCheck(goba)) {
        const li = document.createElement("li")
        li.classList.add("mushroom-list-item")
        li.innerHTML = `<button onclick="router.navigate(${goba.id})"><span>${goba.sloIme}<br><i>${goba.latIme}</i></span><span>${goba.pogostost}, ${goba.zavarovana}, ${goba.naRdečemSeznamu}</span></button>`
        
        li.addEventListener("click", this.handleHideNavButton)
        
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
    
    if (goba?.domačeIme != "/") {
      searchFields.push(...goba.domačeIme)
    }

    const matchesSearch = searchFields.some(term => 
      term && term.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (matchesSearch === false) {
      return false
    }

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
    const matchesProtected = prot ? this.data.zavarovane().seznam.includes(goba.url) : true
    
    const matchesGrowthMonths = months.some(i => i.checked === true) && goba?.data?.časRasti?.length > 0 ? 
      months.some(input => goba.data.časRasti.some(month => input.checked && month.toLowerCase().includes(input.value))
    ) : true

    if (matchesEdibility && 
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
    this.changeDot()
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
  
  changeDot() {
    const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === (this.slideIndex - 1));
    })
  }
  
  populateForIndex(id) {
    const goba = this.data.goba(id)
    this.populateGallery(goba)
    this.populateNames(goba)
    this.populateTooltips(goba)
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
    this.dotsContainer.innerHTML = ""
    
    for (const imageID in goba.data.galerija.slike) {
      // <div class="gallery-wrapper" data-author="Jože Z'doline">
      //   <img class="gallery" src="https://www.gobe.si/slike/Abortiporus_biennis.jpg">
      // </div>
      const images = goba.data.galerija.slike
      const div = document.createElement("div")
      div.classList.add("gallery-wrapper")
      div.setAttribute("data-author", "Avtor: " + images[imageID].avtor || "")
      
      const img = document.createElement("img")
      img.classList.add("gallery")
      img.setAttribute("src", images[imageID].url)
      
      div.appendChild(img)
      this.gallery.appendChild(div)
      
      // Create dots under the image
      const dot = document.createElement("div")
      dot.classList.add("gallery-dot")
      this.dotsContainer.appendChild(dot)
    }

    this.dotsContainer.firstChild.classList.add("active")
    this.showDivs()
  }
  
  populateTooltips(goba) {
    const freq = this.markers[3]
    freq.children[1].innerHTML = `<span class="grey-text">Pogostost na razstavah:</span> ${goba["pogostost"]}`
    freq.setAttribute("data-frequency", goba["pogostost"])
    const percent = ((goba["pogostost"] != "/" ? Number(goba["pogostost"]) : 0) / 23) * 100
    document.documentElement.style.setProperty('--percent', percent)
    
    const protect = this.markers[1]
    //protect.children[1].classList
    protect.children[1].innerHTML = `<span class='grey-text'>Zavarovana goba:</span> ${goba.zavarovana}`
    protect.setAttribute("data-value", goba.zavarovana)
    
    const redList = this.markers[2]
    //redList.children[0].setAttribute("src", "https://www.gobe.si/pub/ikone/lisaj.png")
    if (goba["naRdečemSeznamu"] == "DA") {
      const redListData = this.data.rdeciSeznam()
      const category = redListData["seznam"][goba.url]
      redList.children[1].innerHTML = `<span class='grey-text'>Na rdečem seznamu.</span> ${redListData['iucn']['naslov']}<br>${redListData['iucn']['kategorije'][category]}`
    } else {
      redList.children[1].innerHTML = "<span class='grey-text'>Na rdečem seznamu:</span> NE"
      redList.setAttribute("data-value", "NE") //goba["naRdečemSeznamu"]
    }
    
    const edible = this.markers[0]
    edible.children[0].classList.remove(...edible.children[0].classList)
    if (this.data.uzitne().seznam.includes(goba.url)) {
      edible.children[0].classList.add("edible-green")
      edible.children[1].innerHTML = "<span class='grey-text'>Uporabnost:</span> Užitna"
    } else if (this.data.pogojnoUzitne().seznam.includes(goba.url)) {
      edible.children[0].classList.add("edible-yellow")
      edible.children[1].innerHTML = "<span class='grey-text'>Uporabnost:</span> Pogojno užitna"
    } else if (this.data.strupene().seznam.some(obj => obj.seznam.includes(goba.url))) {
      edible.children[0].classList.add("edible-red")
      edible.children[1].innerHTML = "<span class='grey-text'>Uporabnost:</span> Strupena"
    } else {
      edible.children[0].classList.add("edible-red")
      edible.children[1].innerHTML = "<span class='grey-text'>Uporabnost:</span> Neužitno ali neznano"
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