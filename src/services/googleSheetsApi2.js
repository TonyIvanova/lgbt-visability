
// //googleSheetsApi.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_KEY = process.env.REACT_APP_API_KEY; 
// const CONFIG_SPREADSHEET_ID = process.env.REACT_APP_CONFIG_SPREADSHEET_ID; 

// export default function useSpreadsheetData(spreadsheetId){
//     const [spreadsheetData, setSpreadsheetData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const loadSpreadsheet = async () => {
//         try {
//           const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
//             params: {
//               key: API_KEY,
//               includeGridData: true, // Set to true if you want the cells' data
//             },
//           });
//           setSpreadsheetData(response.data);
//           console.log('Spreadsheet data loaded:', response.data); 
//         } catch (err) {
//           setError(err);
//           console.error('Error loading spreadsheet:', err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       if (spreadsheetId) {
//         loadSpreadsheet();
//       }
//     }, [spreadsheetId]);
  
//     // console.log('spreadsheetData:',spreadsheetData)
//     return { spreadsheetData, loading, error };
//   };
  
// export function getSheetData(sheetName) {
//     const sheet = findSheetByName(preloadedSpreadsheet.sheets, sheetName);
//     if (!sheet) {
//       console.error(`Sheet with name ${sheetName} not found.`);
//       return Promise.resolve([]);
//     }
//     const jsonData = transformData(sheet.data[0].rowData);
//     return Promise.resolve(jsonData);
//   }

// export function getDescriptions(spreadsheetData, language) {
//     const SHEET_NAME = "descriptions";
//     try {
//       // Find the 'descriptions' sheet from preloaded data
//       const descriptionsSheet = spreadsheetData.sheets.find(sheet => sheet.properties.title === SHEET_NAME);
  
//       if (!descriptionsSheet) {
//         console.warn(`Sheet with name '${SHEET_NAME}' not found.`);
//         return [];
//       }
  
//       // Assuming the first element in the 'data' array contains the actual data
//       const rows = descriptionsSheet.data[0].rowData;
  
//       // Assuming the first row contains the header
//       const headers = rows.shift().values.map(cell => cell.formattedValue);
  
//       // Find the indexes of the required columns
//       const keyIndex = headers.indexOf('key');
//       const nameIndex = headers.indexOf(`name_${language}`);
//       const mapIndex = headers.indexOf(`map_${language}`);
//       const barIndex = headers.indexOf(`bar_${language}`);
//       const pieIndex = headers.indexOf(`pie_${language}`);
  
//       // Map the rows to the desired format
//       const descriptions = rows.map(row => {
//         const values = row.values;
//         return {
//           key: values[keyIndex]?.formattedValue,
//           name: values[nameIndex]?.formattedValue,
//           map: values[mapIndex]?.formattedValue,
//           bar: values[barIndex]?.formattedValue,
//           pie: values[pieIndex]?.formattedValue,
//         };
//       });
  
//       // Filter out any rows that did not contain a key (which are required)
//       return descriptions.filter(item => item.key != null);
//     } catch (error) {
//       console.error("Failed to get Descriptions from preloaded data: ", error);
//       return [];
//     }
//   }
//   // Usage:
//   // const descriptions = getDescriptions(preloadedSpreadsheetData, language);
//   // console.log(descriptions);
  
  
// function getConfiguration(spreadsheetData, language) {
//   const configurationSheet = spreadsheetData.sheets.find(sheet => sheet.properties.title === 'configuration');

//   // If the sheet is not found, return an empty object
//   if (!configurationSheet) {
//     console.warn(`Sheet with name '${sheetName}' not found.`);
//     return {};
//   }

//   // Assuming the first element in the 'data' array contains the actual data
//   const rows = configurationSheet.data[0].rowData;

//   // Assuming the first row contains the header
//   const headers = rows.shift().values.map(cell => cell.userEnteredValue.stringValue);

//   // Find the index of the language column we are interested in
//   const keyIndex = headers.indexOf('key');
//   const langIndex = headers.indexOf(language);

//   // Reduce the rows into a configuration map object
//   const configurationMap = rows.reduce((map, row) => {
//     // Assuming that each cell has a 'userEnteredValue' object with 'stringValue' for text
//     const key = row.values[keyIndex]?.userEnteredValue?.stringValue;
//     const translation = row.values[langIndex]?.userEnteredValue?.stringValue;

//     // If key or translation is not defined, skip this row
//     if (!key || !translation) return map;

//     map[translation] = key;
//     return map;
//   }, {});

//   return configurationMap;
// }
// // const configMap = getConfigurationByLanguage(preloadedSpreadsheetData, language);
// // console.log(configMap);




//   function transformData(rows) {
//     if (!rows) {
//       console.error("No data to transform.");
//       return [];
//     }
  
//     var jsonData = [];
//     var colsMap = {};
  
//     // Map column indices to their respective headers
//     rows[0].values.forEach((cell, idx) => {
//       colsMap[idx] = cell.formattedValue;
//     });
  
//     // Transform each row into an object
//     rows.slice(1).forEach(row => {
//       var rowObject = {};
//       row.values.forEach((cell, colIdx) => {
//         rowObject[colsMap[colIdx]] = cell.formattedValue;
//       });
//       jsonData.push(rowObject);
//     });
  
//     return jsonData;
//   }

// export function getSheetIdByYear(preloadedSpreadsheet, year) {
//   // Find the 'sheet_ids_by_year' sheet within the preloaded data
//   const sheetIdsByYear = preloadedSpreadsheet.sheets.find(sheet => sheet.properties.title === 'sheet_ids_by_year');
//   if (!sheetIdsByYear) {
//     console.error('Sheet "sheet_ids_by_year" not found.');
//     return null;
//   }

  
//   const rows = sheetIdsByYear.data[0].rowData.slice(1); // Skip the header row
//   for (const row of rows) {
//     const yearCell = row.values[0]?.formattedValue; // Assuming the year is in the first column
//     const idCell = row.values[1]?.formattedValue; // Assuming the ID is in the second column
//     if (yearCell && parseInt(yearCell, 10) === year) {
//       console.log('idCell:',idCell);
//       return idCell;
//     }
//   }

//   console.error('Year not found in sheet.');
//   return null;
// }
// // // Example usage:
// // const year = "2023";
// // const sheetId = getSheetIdByYear(preloadedSpreadsheet, year);
// // console.log(sheetId); // Should log the sheet ID corresponding to the year "2023"

// export function createTopicsMap(preloadedSpreadsheetData) {
//   const SHEET_NAME = "configuration"; // This is the name of your sheet
//   let topicsMap = {};

//   // Find the configuration sheet from the preloaded data
//   const configurationSheet = preloadedSpreadsheetData.sheets.find(sheet => sheet.properties.title === SHEET_NAME);

//   if (!configurationSheet) {
//     console.warn(`Sheet with name '${SHEET_NAME}' not found.`);
//     return {};
//   }

//   // Assuming the data is in the first 'data' element and the first row (header) has been skipped
//   const rows = configurationSheet.data[0].rowData.slice(1); // Skip the header row

//   rows.forEach(row => {
//     // Assuming 'values' contains the cells in the order of [key, ru, en]
//     const cells = row.values;
//     const key = cells[0]?.formattedValue; // The key
//     const ruTranslation = cells[1]?.formattedValue; // Russian translation
//     const enTranslation = cells[2]?.formattedValue; // English translation

//     // Map both translations to the same key
//     if (key && ruTranslation) {
//       topicsMap[ruTranslation] = key;
//     }
//     if (key && enTranslation) {
//       topicsMap[enTranslation] = key;
//     }
//   });

//   return topicsMap;
// }
// // Example usage:
// // Assuming 'configurationData' is an array of objects representing your rows from the 'configuration' sheet.
// // const topicsMap = createTopicsMap(configurationData);
// // console.log(topicsMap);

