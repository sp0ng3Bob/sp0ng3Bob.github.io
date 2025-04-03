import { data } from "../data/data.js"

// DOM elements
const searchInput = document.querySelector('#search-input')
const plantList = document.querySelector('#plant-list')
const plantDetails = document.querySelector('#plant-details')
const listSize = document.querySelector('#species-list-size')
const images = document.querySelector('#images-results iframe')
const plantNet = document.querySelector('#plant-net-images-results iframe')
const iframeCollapsableTitles = document.querySelectorAll(".collapsible h3")
const noSelection = document.querySelector('#no-selection')
const tabButtons = document.querySelectorAll('.tab')
const contentSections = document.querySelectorAll('.content')

const handleSelectPlantFromList = (plantName) => {
  selectPlant(plantName)
  plantDetails.scrollIntoView({ behavior: 'smooth' })
}

iframeCollapsableTitles.forEach(header => {
  header.addEventListener("click", () => {
    header.parentElement.classList.toggle("active")
  })
})

/* images.addEventListener("load", function () {
  scrollIframe(images)
}) */

// Tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab')
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')
    
    // Update active content
    contentSections.forEach(section => section.classList.remove('active'))
    document.getElementById(`${tabId}-content`).classList.add('active')
  })
})

// Populate plant list
function renderPlantList(plants) {
  for (const li of plantList.children) {
    li.removeEventListener("click", li._clickHandler) //using stored refference
  }
  
  plantList.innerHTML = ''
  const plantNames = Object.keys(plants)
  plantNames.sort().forEach(plantName => {
    const li = document.createElement('li')
    li.textContent = plantName
    li.addEventListener('click', () => handleSelectPlantFromList(plantName))
    plantList.appendChild(li)
  })
  listSize.textContent = plantNames.length
}

// Display plant details
function selectPlant(plantName) {
  // Remove active class from all list items
  document.querySelectorAll('.plant-list li').forEach(item => {
    item.classList.remove('active')
  })
  
  // Find the selected list item and add active class
  const listItems = document.querySelectorAll('.plant-list li')
  for (let item of listItems) {
    if (item.textContent === plantName) {
      item.classList.add('active')
      break
    }
  }
  
  const plant = data.plants[plantName]
  
  if (plant) {
    const q = plantName.replaceAll(' ', '+') //+ "+seed"
    images.setAttribute('src', `https://www.google.com/search?igu=1&ei=&udm=2&q=${q}+seed`)
    const imagesSectionTitle = plantDetails.querySelector('#images-results').previousElementSibling
    imagesSectionTitle.innerHTML = `Image search results <a href="https://www.google.com/search?udm=2&q=${q}+seed" target="_blank">↝</a>`
    
    const pnq = q.replace(/'\w+'/g, "").replace(/\s+/g, "+").trim()
    plantNet.setAttribute('src', `https://identify.plantnet.org/en/k-world-flora/species?search=${pnq}&sortBy=name&sortOrder=asc`)
    const plantNetSectionTitle = plantDetails.querySelector('#plant-net-images-results').previousElementSibling
    plantNetSectionTitle.innerHTML = `PlantNet search results <a href="https://identify.plantnet.org/en/k-world-flora/species?search=${pnq}&sortBy=name&sortOrder=asc" target="_blank">↝</a>`
    
    // Hide no selection message, show details
    noSelection.style.display = 'none'
    plantDetails.style.display = 'block'
    
    // Populate details
    document.querySelector('#plant-name').textContent = plantName
    
    // Quick info
    const quickInfo = []
    document.querySelector("#quick-info").innerHTML = ""
    
    // Viability
    const viabilityElement = document.querySelector('#seed-viability')
    if (plant.viable) {
      const symbolMeaning = data.symbols[plant.viable] || ''
      viabilityElement.innerHTML = `<span class="symbol">${plant.viable}</span> - ${symbolMeaning}`
      if (plant.viable != '') {      
        quickInfo.push([ "symbol", data.emojis[plant.viable] ])
      }
    } else {
      viabilityElement.textContent = "Standard"
    }
    
    // Germination code
    const germCodeElement = document.querySelector('#germ-code')
    const letterMeaning = data.letters[plant.germ_code] || ''
    germCodeElement.innerHTML = `<span class="letter-code">${plant.germ_code}</span> - ${letterMeaning}`
    if (plant.germ_code != '') {      
      quickInfo.push([ "letter", data.emojis[plant.germ_code] ])
    }
    
    // Full info
    document.querySelector('#full-info').innerHTML = plant.full_info
    
    // Additional info (number codes)
    const additionalInfoElement = document.querySelector('#additional-info')
    additionalInfoElement.innerHTML = ''
    if (plant.more && plant.more.length > 0) {
      const validCodes = plant.more.filter(code => code.trim() !== '')
      if (validCodes.length > 0) {
        validCodes.forEach(code => {
          const codeInfo = data.numbers[code] || ''
          const div = document.createElement('div')
          div.className = 'detail-row'
          div.innerHTML = `<span class="number-code">${code}</span> - ${codeInfo}`
          additionalInfoElement.appendChild(div)
          quickInfo.push([ "number", data.emojis[code] ])
        })
      } else {
        additionalInfoElement.textContent = "No additional requirements."
      }
    } else {
      additionalInfoElement.textContent = "No additional requirements."
    }
    
    // Special info
    const specialInfoSection = document.querySelector('#special-info-section')
    const specialInfoElement = document.querySelector('#special-info')
    if (plant.special && plant.special.trim() !== '') {
      specialInfoSection.style.display = 'block'
      const specialSymbolMeaning = data.symbols[plant.special] || ''
      specialInfoElement.innerHTML = `<span class="symbol">${plant.special}</span> - ${specialSymbolMeaning}`
      if (plant.viable != '') {      
        quickInfo.push([ "symbol", data.emojis[plant.viable] ])
      }
    } else {
      specialInfoSection.style.display = 'none'
    }
    
    for (let quick of quickInfo) {
      const span = document.createElement("span")
      span.textContent = quick[1]
      span.classList.add("emoji-card")
      span.classList.add(quick[0])
      document.querySelector("#quick-info").appendChild(span)
    }
  }
}

// Scroll to google search results
/* function scrollIframe(iframe) {
  try {
    iframe.scrollTop = 100
    //const iframeDoc = iframe.contentWindow //.document || iframe.contentDocument.document
    //iframeDoc.scroll({ top: 100, behavior: "smooth" })
    //iframeDoc.scrollTo({ top: 100, behavior: "smooth" })
  } catch (error) {
    console.warn("Cannot access iframe content due to cross-origin restrictions.")
  }
} */

// Filter plants based on search
function filterPlants(query) {
  if (!query) {
    return data.plants
  }
  
  let filteredPlants = {}
  
  if (query.toUpperCase().startsWith("CODE:")) {
    query = query.split(':')[1].trim()
    const tmpFilteredPlants = new Set()

    for (const code of query.split("&")) {
      const upperCode = code.trim().toUpperCase()
      
      if (upperCode.length === 1 && Object.keys(data.emojis).includes(upperCode)) {
        for (const plantName in data.plants) {
          const plant = data.plants[plantName]
          
          if (
            plant["viable"]?.includes(upperCode) ||
            plant["germ_code"]?.includes(upperCode) ||
            plant["special"]?.includes(upperCode) ||
            (Array.isArray(plant["more"]) && plant["more"].some(m => m.includes(upperCode)))
          ) {
            tmpFilteredPlants.add(plantName)
          }
        }
      }
    }
    
    tmpFilteredPlants.forEach(plantName => {
      filteredPlants[plantName] = data.plants[plantName]
    })

  } else {
    query = query.toLowerCase()
    
    Object.keys(data.plants).forEach(plantName => {
      if (plantName.toLowerCase().includes(query)) {
        filteredPlants[plantName] = data.plants[plantName]
      }
    })    
  }
  
  return filteredPlants
}

// Populate code legends
function populateCodeLegends() {
  // Symbols
  const symbolsLegend = document.querySelector('#symbols-legend')
  Object.keys(data.symbols).forEach(symbol => {
    const div = document.createElement('div')
    div.className = 'code-item'
    div.innerHTML = `<span class="code-key symbol">${symbol}</span> - ${data.symbols[symbol]}`
    symbolsLegend.appendChild(div)
  })
  
  // Letters
  const lettersLegend = document.querySelector('#letters-legend')
  Object.keys(data.letters).forEach(letter => {
    const div = document.createElement('div')
    div.className = 'code-item'
    div.innerHTML = `<span class="code-key letter-code">${letter}</span> - ${data.letters[letter]}`
    lettersLegend.appendChild(div)
  })
  
  // Numbers
  const numbersLegend = document.querySelector('#numbers-legend')
  Object.keys(data.numbers).forEach(number => {
    const div = document.createElement('div')
    div.className = 'code-item'
    div.innerHTML = `<span class="code-key number-code">${number}</span> - ${data.numbers[number]}`
    numbersLegend.appendChild(div)
  })
  
  // Temperatures
  const tempsLegend = document.querySelector('#temps-legend')
  Object.keys(data.temperatures).forEach(temp => {
    const div = document.createElement('div')
    div.className = 'code-item'
    div.innerHTML = `<span class="code-key">${temp}°C</span> - ${data.temperatures[temp]}`
    tempsLegend.appendChild(div)
  })
}

// Initialize the app
function init() {
  renderPlantList(data.plants)
  populateCodeLegends()
  
  // Search functionality
  searchInput.addEventListener('input', () => {
    const filtered = filterPlants(searchInput.value)
    renderPlantList(filtered)
  })
}

// Start the app
init()