// googleSpredsheetService.js

const API_KEY = 'AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM';

// Defining a data map for specific years and associated sheet ids from 'config.xlsx'
export async function getDataMap() {
  const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'; 
  const CONFIG_SHEET_NAME = 'years_data';
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_SHEET_ID}/values/${CONFIG_SHEET_NAME}?key=${API_KEY}`);
    const data = await response.json();
    let tempDataMap = {};
    for(let i = 1; i < data.values.length; i++) {
        let year = data.values[i][0];
        let sheetId = data.values[i][1];
        tempDataMap[year] = { report: { sheet: sheetId } };
    }
    console.log('getDataMap: ', tempDataMap)
    return tempDataMap;
  }



  // Cache to store fetched sheet data to avoid unnecessary API calls.
var dataCache = {}
// Function to get data from a specific sheet from  a corresponding'report.xlsx'
export function getSheetData(tableId, sheetName) {
  // const [dataMap, setDataMap] = useState({});
 
     // Check if data for the requested table and sheet is already in cache
    console.log('dataCache:',dataCache)
    
     if(dataCache[tableId+"_"+sheetName]) {
        // If yes - return the cached data   
        return new Promise((resolve, reject) => {
            resolve(dataCache[tableId+"_"+sheetName]);
        })
    }
    // Transform the raw data from the API into a structured JSON format
    function transformData(data) {
        var jsonData = []
        var colsMap = {}
        // Map column indices to their respective headers
        console.log('data',data)
        console.log('data[0]',data[0])
        data[0].forEach( (item, idx) => {
            colsMap[idx] = item
        })
        // Transform each row into an object
        data.forEach( (row, rowIdx) => {
           // Skip the header row
            if(rowIdx == 0) return;
            var rowObject = {}
            row.forEach((cellValue, colIdx) => {
                rowObject[colsMap[colIdx]] = cellValue;
            })
            jsonData.push(rowObject)
        })
        return jsonData;
    }

     // Fetch data from Google Sheets API
    const tableData = new Promise((resolve, reject) => {
      return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/values/${sheetName}?key=${API_KEY}`)
        .then(response => response.json())
        // Cache the transformed data
        .then(data => {
            dataCache[tableId+"_"+sheetName] = transformData(data.values)
            resolve(dataCache[tableId+"_"+sheetName])
            return
        })
    });
  
    return tableData;
  }
 


  // Function to get info  from 'config.xlsx'
export async function getDescriptions(language = 'ru') {
  const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'; 
  const CONFIG_SHEET_descriptions = 'descriptions';
  const data = await getSheetData(CONFIG_SHEET_ID, CONFIG_SHEET_descriptions);
  console.log('getDescriptions: ', data)
  return data.map(item => ({
      key: item.key,
      name: item[`name_${language}`],
      map: item[`map_${language}`],
      pie: item[`pie_${language}`]
  }));
}

export async function getConfiguration(language = 'ru') {
  const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'; 
  const CONFIG_SHEET_name = 'configuration';
  const data = await getSheetData(CONFIG_SHEET_ID, CONFIG_SHEET_name);
  console.log('getConfiguration: ', data)
  return data.map(item => ({
      key: item.key,
      name: item[language]
  }));
}

export async function getFullSpreadsheetData(year, dataMap) {
  const yearData = dataMap[year];
  if (!yearData) return;

  const fetchedData = {};
  
  for (let sheetName in yearData) {
    const sheetId = yearData[sheetName].id;
    fetchedData[sheetName] = await getSheetData(sheetId, sheetName);
  }
  console.log('getFullSpreadsheetData: ', fetchedData)
  // setData(fetchedData);
  return fetchedData
}



 