import { praznikiCSV } from "./data.js"

const time = new Date(Date.now())
const year = time.getFullYear()
const month = time.getMonth()
const day = time.getDate()
const hour = time.getHours()

const prazniki = filterCSVData(parseCSV(), "DELA_PROST_DAN", "da", "===")

// Function to parse the CSV string into an array of objects
function parseCSV() {
  const rows = praznikiCSV.trim().split('\n');
  const headers = rows[0].split(';');

  // Convert the rows into an array of objects
  return rows.slice(1).map(row => {
    const values = row.split(';');
    const rowObject = {};
    
    headers.forEach((header, index) => {
      rowObject[header.trim()] = values[index].trim();
    });
    
    return rowObject;
  });
}

// Function to filter the CSV data based on a column name and filter value
function filterCSVData(data, columnName, filterValue, comparison) {
  switch(comparison) {
    case "!==":
      return data.filter(row => row[columnName] !== filterValue);
    case "===":
      return data.filter(row => row[columnName] === filterValue);
    case ">":
      return data.filter(row => row[columnName] > filterValue);
    case "<":
      return data.filter(row => row[columnName] < filterValue);
    case ">=":
      return data.filter(row => row[columnName] >= filterValue);
    case "<=":
      return data.filter(row => row[columnName] <= filterValue);
    default:
      console.error("Unsupported comparison operator:", comparison);
      return []
  }
}

// Function to format the filtered data (e.g., convert to a string with a delimiter)
function formatCSVData(data) {
  return data.map(row => {
    return Object.values(row).join(' | ');
  }).join('\n');
}

function isLeapYear(year) {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

export function getSeasonMilestones() {
  let nov, feb, mar, oct
  
  if (month <= 9) {
    nov = year - 1
    feb = year
    mar = year
    oct = year
  } else {
    nov = year 
    feb = year + 1
    mar = year + 1
    oct = year + 1
  }
  
  return {
    "nov": new Date(Date.UTC(nov, 10, 1)),
    "feb": new Date(Date.UTC(feb, 1, isLeapYear(feb) ? 29 : 28)),
    "mar": new Date(Date.UTC(mar, 2, 1)),
    "oct": new Date(Date.UTC(oct, 9, 31))
  }
}

export function getCurrentSeason() {
  return month >= 2 && month <= 9 ? "nižja" : "višja"
}

export function isHoliday() {
  const filtered = filterCSVData(prazniki, "DATUM", `${day}.${(month + 1).toString().padStart(2, '0')}.${year}`, "===")
  return filtered.length > 0 || time.getDay() === 0
}

export function getCurrentRate(data) {
  return data[hour]
}

export function getNextCheaperRate(data) {
  let currentHour = hour
  let currentRate = data[currentHour]
  currentHour++
  while (currentRate <= data[currentHour]) {
    currentRate = data[currentHour]
    currentHour++
  }
  
  const startMinutes = new Date(Date.UTC(year, month, day, hour)).getTime / (1000 * 60) - time.getTime() / (1000 * 60)
  const endMinutes = (currentHour - hour) * 60
  
  return [
    data[currentHour], 
    "todo", //endMinutes - startMinutes
    currentHour
  ]
}