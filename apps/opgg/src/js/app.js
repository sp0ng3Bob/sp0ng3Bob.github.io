import { data } from "../data/data.js"

// DOM elements
const searchInput = document.querySelector('#search-input');
const plantList = document.querySelector('#plant-list');
const plantDetails = document.querySelector('#plant-details');
const noSelection = document.querySelector('#no-selection');
const tabButtons = document.querySelectorAll('.tab');
const contentSections = document.querySelectorAll('.content');

// Tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active content
    contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${tabId}-content`).classList.add('active');
  });
});

// Populate plant list
function renderPlantList(plants) {
  plantList.innerHTML = '';
  const plantNames = Object.keys(plants)
  plantNames.sort().forEach(plantName => {
    const li = document.createElement('li');
    li.textContent = plantName;
    li.addEventListener('click', () => selectPlant(plantName));
    plantList.appendChild(li);
  });
  document.querySelector('#species-list-size').textContent = plantNames.length
}

// Display plant details
function selectPlant(plantName) {
  // Remove active class from all list items
  document.querySelectorAll('.plant-list li').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find the selected list item and add active class
  const listItems = document.querySelectorAll('.plant-list li');
  for (let item of listItems) {
    if (item.textContent === plantName) {
      item.classList.add('active');
      break;
    }
  }
  
  const plant = data.plants[plantName];
  
  if (plant) {
    // Hide no selection message, show details
    noSelection.style.display = 'none';
    plantDetails.style.display = 'block';
    
    // Populate details
    document.querySelector('#plant-name').textContent = plantName;
    
    // Quick info
    const quickInfo = []
    document.querySelector("#quick-info").innerHTML = ""
    
    // Viability
    const viabilityElement = document.querySelector('#seed-viability');
    if (plant.viable) {
      const symbolMeaning = data.symbols[plant.viable] || '';
      viabilityElement.innerHTML = `<span class="symbol">${plant.viable}</span> - ${symbolMeaning}`;
      quickInfo.push(data.emojis[plant.viable])
    } else {
      viabilityElement.textContent = "Standard";
    }
    
    // Germination code
    const germCodeElement = document.querySelector('#germ-code');
    const letterMeaning = data.letters[plant.germ_code] || '';
    germCodeElement.innerHTML = `<span class="letter-code">${plant.germ_code}</span> - ${letterMeaning}`;
    quickInfo.push(data.emojis[plant.germ_code])
    
    // Full info
    document.querySelector('#full-info').innerHTML = plant.full_info;
    
    // Additional info (number codes)
    const additionalInfoElement = document.querySelector('#additional-info');
    additionalInfoElement.innerHTML = '';
    if (plant.more && plant.more.length > 0) {
      const validCodes = plant.more.filter(code => code.trim() !== '');
      if (validCodes.length > 0) {
        validCodes.forEach(code => {
          const codeInfo = data.numbers[code] || '';
          const div = document.createElement('div');
          div.className = 'detail-row';
          div.innerHTML = `<span class="number-code">${code}</span> - ${codeInfo}`;
          additionalInfoElement.appendChild(div);
          quickInfo.push(data.emojis[code])
        });
      } else {
        additionalInfoElement.textContent = "No additional requirements.";
      }
    } else {
      additionalInfoElement.textContent = "No additional requirements.";
    }
    
    // Special info
    const specialInfoSection = document.querySelector('#special-info-section');
    const specialInfoElement = document.querySelector('#special-info');
    if (plant.special && plant.special.trim() !== '') {
      specialInfoSection.style.display = 'block';
      const specialSymbolMeaning = data.symbols[plant.special] || '';
      specialInfoElement.innerHTML = `<span class="symbol">${plant.special}</span> - ${specialSymbolMeaning}`;
      quickInfo.push(data.emojis[plant.special])
    } else {
      specialInfoSection.style.display = 'none';
    }
    
    for (let quick of quickInfo) {
      const span = document.createElement("span")
      span.textContent = quick
      span.classList.add("emoji-card")
      document.querySelector("#quick-info").appendChild(span)
    }
  }
}

// Filter plants based on search
function filterPlants(query) {
  if (!query) {
    return data.plants;
  }
  
  query = query.toLowerCase();
  const filteredPlants = {};
  
  Object.keys(data.plants).forEach(plantName => {
    if (plantName.toLowerCase().includes(query)) {
      filteredPlants[plantName] = data.plants[plantName];
    }
  });
  
  return filteredPlants;
}

// Populate code legends
function populateCodeLegends() {
  // Symbols
  const symbolsLegend = document.querySelector('#symbols-legend');
  Object.keys(data.symbols).forEach(symbol => {
    const div = document.createElement('div');
    div.className = 'code-item';
    div.innerHTML = `<span class="code-key symbol">${symbol}</span> - ${data.symbols[symbol]}`;
    symbolsLegend.appendChild(div);
  });
  
  // Letters
  const lettersLegend = document.querySelector('#letters-legend');
  Object.keys(data.letters).forEach(letter => {
    const div = document.createElement('div');
    div.className = 'code-item';
    div.innerHTML = `<span class="code-key letter-code">${letter}</span> - ${data.letters[letter]}`;
    lettersLegend.appendChild(div);
  });
  
  // Numbers
  const numbersLegend = document.querySelector('#numbers-legend');
  Object.keys(data.numbers).forEach(number => {
    const div = document.createElement('div');
    div.className = 'code-item';
    div.innerHTML = `<span class="code-key number-code">${number}</span> - ${data.numbers[number]}`;
    numbersLegend.appendChild(div);
  });
  
  // Temperatures
  const tempsLegend = document.querySelector('#temps-legend');
  Object.keys(data.temperatures).forEach(temp => {
    const div = document.createElement('div');
    div.className = 'code-item';
    div.innerHTML = `<span class="code-key">${temp}°C</span> - ${data.temperatures[temp]}`;
    tempsLegend.appendChild(div);
  });
}

// Initialize the app
function init() {
  renderPlantList(data.plants);
  populateCodeLegends();
  
  // Search functionality
  searchInput.addEventListener('input', () => {
    const filtered = filterPlants(searchInput.value);
    renderPlantList(filtered);
  });
}

// Start the app
init();

/* 
//import sax from 'https://cdn.jsdelivr.net/npm/sax@1.4.1/+esm'
//import saferBuffer from 'https://cdn.jsdelivr.net/npm/safer-buffer@2.1.2/+esm'
//import iconvLite from 'https://cdn.jsdelivr.net/npm/iconv-lite@0.6.3/+esm'
//import htmlEntities from 'https://cdn.jsdelivr.net/npm/html-entities@2.5.2/+esm'
//import needle from 'https://cdn.jsdelivr.net/npm/needle@3.3.1/+esm'
//import duckDuckScrape from 'https://cdn.jsdelivr.net/npm/duck-duck-scrape@2.2.7/+esm'

// DOM elements
const searchInput = document.querySelector('#search-input');
const plantList = document.querySelector('#plant-list');
const plantListSize = document.querySelector('#species-list-size');
const plantDetails = document.querySelector('#plant-details');
const noSelection = document.querySelector('#no-selection');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
// ontarioSection = 
const googleSection = document.querySelector('#google-images iframe');

// Populate reference tables
function populateReferenceTables() {
  // Symbols table
  const symbolsTable = document.querySelector('#symbols-table').querySelector('tbody');
  symbolsTable.innerHTML = '';
  Object.entries(data.symbols).forEach(([symbol, meaning]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${symbol}</td><td>${meaning}</td>`;
    symbolsTable.appendChild(tr);
  });
  
  // Letters table
  const lettersTable = document.querySelector('#letters-table').querySelector('tbody');
  lettersTable.innerHTML = '';
  Object.entries(data.letters).forEach(([letter, meaning]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${letter}</td><td>${meaning}</td>`;
    lettersTable.appendChild(tr);
  });
  
  // Numbers table
  const numbersTable = document.querySelector('#numbers-table').querySelector('tbody');
  numbersTable.innerHTML = '';
  Object.entries(data.numbers).forEach(([number, meaning]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${number}</td><td>${meaning}</td>`;
    numbersTable.appendChild(tr);
  });
  
  // Temperatures table
  const temperaturesTable = document.querySelector('#temperatures-table').querySelector('tbody');
  temperaturesTable.innerHTML = '';
  Object.entries(data.temperatures).forEach(([temp, meaning]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${temp}°C</td><td>${meaning}</td>`;
    temperaturesTable.appendChild(tr);
  });
}

// Populate plant list
function renderPlantList(plants) {
  plantList.innerHTML = '';
  const plantNames = Object.keys(plants)
  plantNames.sort().forEach(plantName => {
    const li = document.createElement('li');
    li.textContent = plantName;
    li.dataset.name = plantName;
    li.addEventListener('click', () => selectPlant(plantName));
    plantList.appendChild(li);
  });
  plantListSize.textContent = plantNames.length
}

// Display plant details
function selectPlant(plantName) {
  // Remove active class from all list items
  document.querySelectorAll('.plant-list li').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to selected item
  document.querySelector(`.plant-list li[data-name="${plantName}"]`).classList.add('active');
  
  const plant = data.plants[plantName];
  
  if (plant) {
    // Hide no selection message, show details
    noSelection.style.display = 'none';
    plantDetails.style.display = 'block';
    
    //set duckduckgo image search results
    duckDuckScrape(plantName+" seed").then(results => {
      console.log(results);
    });
    
    // Populate basic details
    document.querySelector('#plant-name').textContent = plantName;
    
    // Seed viability
    const viabilityElement = document.querySelector('#seed-viability');
    const viabilityTooltip = document.querySelector('#viability-tooltip');
    if (plant.viable && plant.viable !== "") {
      viabilityElement.textContent = plant.viable;
      if (data.symbols[plant.viable]) {
        viabilityTooltip.style.display = 'inline-block';
        document.querySelector('#viability-info').textContent = data.symbols[plant.viable];
      } else {
        viabilityTooltip.style.display = 'none';
      }
    } else {
      viabilityElement.textContent = "Standard";
      viabilityTooltip.style.display = 'none';
    }
    
    // Germination code
    const germCodeElement = document.querySelector('#germ-code');
    const germCodeTooltip = document.querySelector('#germ-code-tooltip');
    if (plant.germ_code && plant.germ_code !== "") {
      germCodeElement.textContent = plant.germ_code;
      if (data.letters[plant.germ_code]) {
        germCodeTooltip.style.display = 'inline-block';
        document.querySelector('#germ-code-info').innerHTML = data.letters[plant.germ_code];
      } else {
        germCodeTooltip.style.display = 'none';
      }
    } else {
      germCodeElement.textContent = "Not specified";
      germCodeTooltip.style.display = 'none';
    }
    
    // Full info
    document.querySelector('#full-info').innerHTML = plant.full_info || "Not available";
    
    // Additional information (more array)
    for (let i = 0; i < 4; i++) {
      const infoValue = plant.more[i];
      const rowElement = document.querySelector(`#more-info-${i+1}-row`);
      const infoElement = document.querySelector(`#more-info-${i+1}`);
      const tooltipElement = document.querySelector(`#more-info-${i+1}-tooltip`);
      
      if (infoValue && infoValue !== "") {
        rowElement.style.display = 'block';
        infoElement.textContent = infoValue;
        
        if (data.numbers[infoValue]) {
          tooltipElement.style.display = 'inline-block';
          document.querySelector(`#more-info-${i+1}-text`).innerHTML = data.numbers[infoValue];
        } else {
          tooltipElement.style.display = 'none';
        }
      } else {
        rowElement.style.display = 'none';
      }
    }
    
    // Special information
    const specialInfoSection = document.querySelector('#special-info-section');
    const specialInfoElement = document.querySelector('#special-info');
    
    if (plant.special && plant.special !== "") {
      specialInfoSection.style.display = 'block';
      if (data.symbols[plant.special]) {
        specialInfoElement.innerHTML = data.symbols[plant.special];
      } else {
        specialInfoElement.textContent = plant.special;
      }
    } else {
      specialInfoSection.style.display = 'none';
    }
  }
}

// Filter plants based on search
function filterPlants(query) {
  if (!query) {
    return data.plants;
  }
  
  query = query.toLowerCase();
  const filtered = {};
  
  Object.entries(data.plants).forEach(([name, info]) => {
    if (name.toLowerCase().includes(query)) {
      filtered[name] = info;
    }
  });
  
  return filtered;
}

// Tab switching
function setupTabs() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const contentId = tab.dataset.tab;
      document.getElementById(contentId).classList.add('active');
    });
  });
}

// Initialize the app
function init() {
  renderPlantList(data.plants);
  populateReferenceTables();
  setupTabs();
  
  // Search functionality
  searchInput.addEventListener('input', () => {
    const filtered = filterPlants(searchInput.value);
    renderPlantList(filtered);
  });
}

// Start the app
init(); */