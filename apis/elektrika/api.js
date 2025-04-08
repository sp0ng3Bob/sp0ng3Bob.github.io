import { 
  tarifnePostavke,
  tarifneSezone,
  nizjaSezona,
  visjaSezona
} from "./data.js";

import {
  getSeasonMilestones,
  getCurrentRate,
  getNextCheaperRate,
  isWorkfree
} from "./time.js"

const infoDiv = document.querySelector("#info")
const jsonDiv = document.querySelector("#json")

const endPoints = ["tarifnePostavke", "tarifneSezone", "nizjaSezona", "visjaSezona", "trenutnaTarifa"]

function toggleView() {
  infoDiv.classList.toggle("hidden")
  jsonDiv.classList.toggle("hidden")
}

// Function to get query parameter from the URL
function getQueryParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramsList = [];

  // Collect all parameter keys into an array
  for (const key of urlParams.keys()) {
    paramsList.push(key);
  }

  return paramsList;
}

// Display data based on the query parameter in the URL
function displayDataBasedOnQuery() {
  const queryParameters = getQueryParameters();
  const endPoint = queryParameters[0]; // This will be the endpoint (first parameter key)
  const otherParams = queryParameters.slice(1);

  // Display content based on the query parameter
  if (endPoints.includes(endPoint)) {
    if (jsonDiv.classList.length > 0) {
      toggleView()
    }
    
    let jsonData = {}
    switch(endPoint) {
      case "tarifnePostavke":
        jsonData = tarifnePostavke;
        break;
      case "tarifneSezone":
        const milestones = getSeasonMilestones()
        jsonData = JSON.parse(JSON.stringify(tarifneSezone));
        jsonData.sezone["nižja"]["od"] = milestones.mar
        jsonData.sezone["nižja"]["do"] = milestones.oct
        jsonData.sezone["višja"]["od"] = milestones.nov
        jsonData.sezone["višja"]["do"] = milestones.feb
        break;
      case "nizjaSezona":
        jsonData = nizjaSezona;
        break;
      case "visjaSezona":
        jsonData = visjaSezona;
        break;
      case "trenutnaTarifa":        
        jsonData.naslov = "Trenutna tarifa";
        jsonData.prostDan = isWorkfree() ? "DA" : "NE"
        jsonData.trenutnaTarifa = tarifnePostavke.postavke.seznam[getCurrentRate(nizjaSezona, visjaSezona)]

        const cheaperRate = getNextCheaperRate(nizjaSezona, visjaSezona)
        jsonData.cenejsaTarifa = tarifnePostavke.postavke.seznam[cheaperRate[0]] || {}
        jsonData.cenejsaTarifa["seZačne"] = {}
        jsonData.cenejsaTarifa["seZačne"]["čez"] = cheaperRate[1]
        jsonData.cenejsaTarifa["seZačne"]["enota"] = "min"
        jsonData.cenejsaTarifa["seZačne"]["ob"] = cheaperRate[2]
        break;
    }
    
    if (otherParams.includes("download")) {
      downloadJsonFile(`${endPoint} - ${new Date(Date.now())}.json`, jsonData)
      displayNotFound()
    } else {
      displayJsonData(jsonData);      
    }
    
  } else {
    displayNotFound();
  }
}

// Function to display data for "tarifnePostavke"
function displayJsonData(jsonData) {
  jsonDiv.innerHTML = `<pre>${JSON.stringify(jsonData, undefined, 2)}</pre>`
  
  if (jsonData.prostDan) { //WFT is this..
    document.querySelector("body").style.backgroundColor = jsonData.trenutnaTarifa.barva
    
    if (jsonData.trenutnaTarifa.barva == "#0000FF") {
      document.querySelector("pre").style.color = "white"
    }
    else {
      document.querySelector("pre").style.color = "black"
    }
  } else {
    document.querySelector("body").style.backgroundColor = "white"
  }
}

function displayNotFound() {
  if (infoDiv.classList.length > 0) {
    toggleView()
  }
}

function downloadJsonFile(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
}

// Run display function when page loads or query parameter changes
window.onload = displayDataBasedOnQuery;
window.onpopstate = displayDataBasedOnQuery;