// googleSpredsheetService.js
const API_KEY = process.env.REACT_APP_API_KEY; 

// Object for mapping spreadsheets to their ids in Google Drive
export const dataMap = {
  'config': '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE',
}


// Cache object for storing fetched data to reduce API calls
var dataCache = {}

// get from config/sheet_ids_by_year:  year -> id
async function loadConfig() {
var configData = await getSheetData(dataMap['config'], 'sheet_ids_by_year')
configData.forEach(function(itm) {
    dataMap[itm.year] = itm.id
    // console.log('GSHEETS/dataMap:',dataMap)
  }
)
}


//  retrieve data from a gsheet and cache it
export async function getSheetData(tableId, sheetName) {

   // Check if is in cache first 
  if(dataCache[tableId+"_"+sheetName]) {
      return new Promise((resolve, reject) => { // returns a Promise that resolves to the requested data
          resolve(dataCache[tableId+"_"+sheetName]);
      })
  }

  // If not a 'config' table, ensure 'config' is loaded
  if(tableId !== dataMap['config']){
    await loadConfig()
  }

  // To transform the raw sheet data into a more usable JSON format
  function transformSheetRowsData(rowData) {
    var colsMap = {}
    var jsonData = []
    if(!rowData) {
      return jsonData
    }
    // console.log(rowData)

    // extracts first row
    rowData[0].values.forEach( (item, idx) => {
      colsMap[idx] = item.formattedValue
    })

    // transforms {userEnteredValue: {…}, effectiveValue: {…}, formattedValue: 'Дальневосточный федеральный округ', effectiveFormat: {…}}
    // to { columnName1: formattedValue, ... }
    rowData.forEach( (row, rowIdx) => {
      if(rowIdx === 0) return;
      var rowObject = {}
      row.values.forEach((cellValue, colIdx) => {
          rowObject[colsMap[colIdx]] = cellValue.formattedValue;
      })
      jsonData.push(rowObject)
    })
    // console.log('jsonData:',jsonData)
    return jsonData
  }

  // iterate sheets
  function fillCachesWithTransformedWorksheetsData(data) {
      // console.log(data)
      data.sheets.forEach( (sheet) => {//for each sheet in a spreadsheet
        // console.log('sheet',sheet)
        dataCache[tableId+"_"+sheet.properties.title] = transformSheetRowsData(sheet.data[0].rowData)
      })
  }

  // get data from each sheet
  const worksheetData = new Promise((resolve, reject) => {
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/?key=${API_KEY}&includeGridData=true`)
      .then(response => response.json())
      .then(data => {
          console.log(data)
          fillCachesWithTransformedWorksheetsData(data)
          resolve(dataCache[tableId+"_"+sheetName])
          return dataCache[tableId+"_"+sheetName]
      })
  });
  console.log('dataCache:',dataCache)
  return worksheetData;
}

async function getSheetsMetadata(spreadsheetId) {
  // Fetch the spreadsheet metadata from the Google Sheets API
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties&key=${API_KEY}`);
  const data = await response.json();
  // Return the metadata for all sheets in the spreadsheet
  return data.sheets;
}


export async function loadYearData(year) {
  await loadConfig()
  const spreadsheetId = dataMap[year];
  
  if (!spreadsheetId) {
    throw new Error(`Spreadsheet ID not found for year: ${year}`);
  }

  try {
    // get data for all sheets in the spreadsheet
    const sheetsMetadata = await getSheetsMetadata(spreadsheetId);
    // Now fetch data for each sheet and store it in cache
    for (const sheet of sheetsMetadata) {
      await getSheetData(spreadsheetId, sheet.properties.title);
    }
    console.log('dataCache:',dataCache)
    return 'All sheets data fetched and stored in cache.';
  } catch (error) {
    console.error(`Error fetching data for year ${year}:`, error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
}
// Loads data to cache for a given year by fetching the corresponding Google Sheet ID from dataMap
// export async function loadYearData(year, sheetName) {
//   await loadConfig()
//   return getSheetData(dataMap[year], sheetName)
// }

export async function getSectionsByLanguage(lang) {
  const configKey = 'config'; // Key for the config in dataMap
  const sectionsSheetName = 'configuration'; // The sheet name where sections are stored
  const cacheKey = `${dataMap[configKey]}_${sectionsSheetName}`;

  if (dataCache[cacheKey]) {
    // Data is in cache, map and return it
    return dataCache[cacheKey].map(item => [item.key, item[lang]]);
  } else {
    // Data is not in cache, fetch and cache it
    try {
      const data = await getSheetData(dataMap[configKey], sectionsSheetName);
      // map and return it
      return data.map(item => [item.key, item[lang]]);
    } catch (error) {
      console.error('Error fetching sections data:', error);
      throw error;
    }
  }
}


export async function getDescriptionsByLanguage(language) {
  // Assuming dataMap and dataCache are accessible here
  const configKey = 'config'; // Use the appropriate key for descriptions in your dataMap
  const spreadsheetId = dataMap[configKey];
  const cacheKey = `${spreadsheetId}_descriptions`;

  const descriptionsData = dataCache[cacheKey];
  if (!descriptionsData) {
    throw new Error('Descriptions data is not available in the cache.');
  }

  // Map the descriptions to the specified language
  const descriptions = descriptionsData.map(desc => ({
    key: desc.key,
    name: desc[`name_${language}`],
    bar: desc[`bar_${language}`],
    map: desc[`map_${language}`],
    pie: desc[`pie_${language}`] || "none", // Fallback to "none" if undefined
  }));

  return descriptions;
}


export async function getConclusionsByLanguage(year, language) {
  // Assuming dataMap and dataCache are accessible here
  const configKey = year; // Use the appropriate key for descriptions in your dataMap
  const spreadsheetId = dataMap[configKey];
  const cacheKey = `${spreadsheetId}_conclusions`;

  const conclusionsData = dataCache[cacheKey];
  if (!conclusionsData) {
    throw new Error('Conclusions data is not available in the cache.');
  }

  const conclusions = conclusionsData.map(desc => ({
    key: desc.key,
    name: desc[`name_${language}`],
    text: desc[`text_${language}`] || "none", // Fallback to "none" if undefined
  }));

  return conclusions;
}


export async function getStoriesByLanguage(year, language) {
  // Assuming dataMap and dataCache are accessible here
  const configKey = year; // Use the appropriate key for descriptions in your dataMap
  const spreadsheetId = dataMap[configKey];
  const cacheKey = `${spreadsheetId}_df_stories_filtered`;

  const storiesData = dataCache[cacheKey];
  if (!storiesData) {
    throw new Error('Stories data is not available in the cache.');
  }

  // Map the descriptions to the specified language
  const stories = storiesData.map(desc => ({
    key: desc.key,
    name: desc[`name_${language}`],
    text: desc[`text_${language}`],
    author: desc[`author_${language}`] || "none", // Fallback to "none" if undefined
  }));

  return stories;
}



export async function getConfigurationByLanguage(language) {
  // Assuming dataMap and dataCache are accessible here
  const configKey = 'config'; // Use the appropriate key for descriptions in your dataMap
  const spreadsheetId = dataMap[configKey];
  const cacheKey = `${spreadsheetId}_configuration`;

  const configurationData = dataCache[cacheKey];
  if (!configurationData) {
    throw new Error('Stories data is not available in the cache.');
  }

  const configuration = configurationData.map((item) => ({
    key: item.key,
    name: item[language], 
  }));
  return configuration;
}

export async function makeTopicsMap() {
  const configKey = 'config'; // Use the appropriate key for configuration in your dataMap
  const spreadsheetId = dataMap[configKey];
  const cacheKey = `${spreadsheetId}_configuration`;

  const configurationData = dataCache[cacheKey];
  if (!configurationData) {
    throw new Error('Configuration data is not available in the cache.');
  }

  const topicsMap = {};

  // Build the map by iterating over the configuration data
  configurationData.forEach((item) => {
    // For each configuration item, map both the English and Russian terms to the key
    topicsMap[item['ru']] = item.key;
    topicsMap[item['en']] = item.key;
  });

  return topicsMap;
}
export const topicsMap = makeTopicsMap()

// Example usage:
// const descriptions = getDescriptionsByLanguage('ru');


// const API_KEY = 'AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM';

// // Defining a data map for specific years and associated sheet ids from 'config.xlsx'
// export async function getDataMap() {
//   const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'; 
//   const CONFIG_SHEET_NAME = 'years_data';
//   const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_SHEET_ID}/values/${CONFIG_SHEET_NAME}?key=${API_KEY}`);
//     const data = await response.json();
//     let tempDataMap = {};
//     for(let i = 1; i < data.values.length; i++) {
//         let year = data.values[i][0];
//         let sheetId = data.values[i][1];
//         tempDataMap[year] = { report: { sheet: sheetId } };
//     }
//     // console.log('gheetService/getDataMap: ', tempDataMap)
//     return tempDataMap;
//   }



//   // Cache to store fetched sheet data to avoid unnecessary API calls.
// var dataCache = {}
// // Function to get data from a specific sheet from  a corresponding'report.xlsx'
// export function getSheetData(tableId, sheetName) {
//       if (!tableId || !sheetName) {
//         console.log("tableId and sheetName is not provided. Refusing to make an API call.");
//       }
//      // Check if data for the requested table and sheet is already in cache
//     //  console.log('tableId:',tableId)
//     //  console.log('sheetName:',sheetName)
//      if(dataCache[tableId+"_"+sheetName]) {
//         // If yes - return the cached data   
//         return new Promise((resolve, reject) => {
//             resolve(dataCache[tableId+"_"+sheetName]);
//         })
//     }
//     // Transform the raw data from the API into a structured JSON format
//   function transformData(data) {
//       if (!data || data === undefined) {
//       console.info("Trying to transform data, but data is not defined.", data); 
//         return;
//       }
//         var jsonData = []
//         var colsMap = {}
//         // Map column indices to their respective headers
//         // console.log('gsheetService/data',data)
//         // console.log('data[0]',data[0])
        
//         data[0].forEach( (item, idx) => {
//             colsMap[idx] = item
//         })
//         // Transform each row into an object
//         data.forEach( (row, rowIdx) => {
//            // Skip the header row
//             if(rowIdx == 0) return;
//             var rowObject = {}
//             row.forEach((cellValue, colIdx) => {
//                 rowObject[colsMap[colIdx]] = cellValue;
//             })
//             jsonData.push(rowObject)
//         })
//         return jsonData;
//     }

//      // Fetch data from Google Sheets API
//   const tableData = new Promise((resolve, reject) => {
//          if (!tableId || !sheetName || tableId === undefined|| sheetName===undefined) {
//         console.log("tableId and sheetName is not provided. Refusing to make an API call.");
//       }

//       return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/values/${sheetName}?key=${API_KEY}`)
//         .then(response => response.json())
        
//         // Cache the transformed data
//         .then(data => {
//           // console.log('sghs/data',data)
//             dataCache[tableId+"_"+sheetName] = transformData(data.values)
//             resolve(dataCache[tableId+"_"+sheetName])
//             return
//         })
//     });
  
//     return tableData;
//   }
 


//   // Function to get info  from 'config.xlsx'
// export async function getDescriptions(language = "ru") {
//   const CONFIG_SHEET_ID = "1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE";
//   const CONFIG_SHEET_descriptions = "descriptions";
//   try {
//     const data = await getSheetData(CONFIG_SHEET_ID, CONFIG_SHEET_descriptions);
//     // console.log('getDescriptions: ', data)
//     return data.map((item) => ({
//       key: item.key,
//       name: item[`name_${language}`],
//       map: item[`map_${language}`],
//       bar: item[`bar_${language}`],
//       pie: item[`pie_${language}`],
//     }));
//   } catch (error) {
//     console.error("Failed to get Descriptions.");
//     return [];
//   }
// }

// // export async function getStories(dataMap, topic, language = 'ru') {
// //   // Assuming SPREADSHEET_ID is a global constant or needs to be passed as a parameter.
// //   const rawData = await getSheetData( dataMap[year]['report']['sheet'], 'df_stories_filtered');

// //   // Map the raw data to the desired structure
// //   const mappedData = rawData.map(item => ({
// //     key: item.key,
// //     name: item[`name_${language}`],
// //     text: item[`text_${language}`],
// //     author: item[`author_${language}`]
// //   }));

// // Filter the stories based on the topic
// //   const topicStories = mappedData.filter(story => story.name === topic);

// //   return topicStories;
// // }

// // export async function getDMapData(spreadsheet_id, topic_key) {
// //   const res = await getSheetData(spreadsheet_id, topic_key);
// //   console.log('getDMapData: ', res)
// //   return res.map((row) => ({
// //     name: row.District,
// //     value: parseFloat(row[selectedQuestion]),
// //   }));

// // }

// // export async function getBarData(spreadsheet_id, topic_key) {
// //   const res = await getSheetData(spreadsheet_id, topic_key);
// //   console.log('getBarData: ', res)
// //   if (res?.length === 0) return [];
// //   //get qiuestions
// //     const fields = Object.keys(res[0])
// //       .filter((key) => key !== "District" && key !== "All")
// //       .map((key) => {
// //         return key;
// //       });
// //      //get row Vse districts
// //     const values = res.find((row) => row.District === "Все");
// //     const result = fields.map((field) => {
// //       //name=district value=for Question
// //       return { name: field, value: parseFloat(values[field]) };
// //     });
// //     return result;
// //   };

// // export async function getPieData(spreadsheet_id, topic_key) {
// //   const res = await getSheetData(spreadsheet_id, topic_key);
// //   console.log('getBarData: ', res)
// //   if (res?.length === 0) return [];
// //     const fields = Object.keys(res[0])
// //       .filter((key) => key !== "District" && key !== "All")
// //       .map((key) => {
// //         return key;
// //       });
// //     const values = res.find((row) => row.District === "Все");
// //     const result = fields.map((field) => {
// //       return { name: field, value: parseFloat(values[field]) };
// //     });
// //     return result;
// //   };

// export async function getPieData(topic, language = "ru") {
//   const CONFIG_SHEET_ID = "1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE";
//   const CONFIG_SHEET_descriptions = "descriptions";

//   // console.log('getDescriptions: ', data)
//   try {
//     const data = await getSheetData(CONFIG_SHEET_ID, CONFIG_SHEET_descriptions);
//     return data.map((item) => ({
//       key: item.key,
//       name: item[`name_${language}`],
//       map: item[`map_${language}`],
//       pie: item[`pie_${language}`],
//     }));
//   } catch (error) {
//     console.info("Failed to get Map Data");
//     return [];
//   }
// }

// export async function getConfiguration(language = 'ru') {
//   const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'; 
//   const CONFIG_SHEET_name = 'configuration';
  
//   try {
//      const data = await getSheetData(CONFIG_SHEET_ID, CONFIG_SHEET_name);
//      // console.log('getConfiguration: ', data)
//      return data.map((item) => ({
//        key: item.key,
//        name: item[language],
//      }));
//   } catch (error) {
//     console.info("Failed to get Configuration data.") 
//     return []
//   }
 
// }

// export async function getFullSpreadsheetData(year, dataMap) {
//   const yearData = dataMap[year];
//   if (!yearData) return;

//   const fetchedData = {};
  
//   for (let sheetName in yearData) {
//     const sheetId = yearData[sheetName].id;
//     try {
//     fetchedData[sheetName] = await getSheetData(sheetId, sheetName);      
//     } catch (error) {
//       console.info("Failed to get data;")
//       console.error(error); 
//     }
//   }
//   // console.log('getFullSpreadsheetData: ', fetchedData)
//   // setData(fetchedData);
//   return fetchedData
// }



 