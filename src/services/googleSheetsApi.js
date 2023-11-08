
//googleSheetsApi.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; 
const CONFIG_SPREADSHEET_ID = process.env.REACT_APP_CONFIG_SPREADSHEET_ID; 

 
export const getSpreadsheetData = async (spreadsheetId, API_KEY) => {
  try {
    const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      params: {
        key: API_KEY,
        includeGridData: true, // Set to true if you want to include cells data
      },
    });
    console.log('Spreadsheet data loaded:', response.data);
    return response.data; // This will be the data you're interested in
  } catch (err) {
    console.error('Error loading spreadsheet:', err);
    throw err; // Throw error to be handled where the function is called
  }
};


export function getSheetData(preloadedSpreadsheet, sheetName) {
  const sheet = preloadedSpreadsheet.find(sheet => sheet.properties.title === sheetName)
  
  if (!sheet) {
    console.error(`Sheet with name ${sheetName} not found.`);
    return Promise.resolve([]);
  }
  const jsonData = transformData(sheet.data[0].rowData);
  return Promise.resolve(jsonData);
}

export function getDescriptions(preloadedSpreadsheet, language) {
  const SHEET_NAME = 'descriptions'
  try {
    // Find the 'descriptions' sheet from preloaded data
    const descriptionsSheet = getSheetData(preloadedSpreadsheet, SHEET_NAME)

    if (!descriptionsSheet) {
      console.warn(`Sheet with name '${SHEET_NAME}' not found.`);
      return [];
    }

    // Assuming the first element in the 'data' array contains the actual data
    const rows = descriptionsSheet.data[0].rowData;

    // Assuming the first row contains the header
    const headers = rows.shift().values.map(cell => cell.formattedValue);

    // Find the indexes of the required columns
    const keyIndex = headers.indexOf('key');
    const nameIndex = headers.indexOf(`name_${language}`);
    const mapIndex = headers.indexOf(`map_${language}`);
    const barIndex = headers.indexOf(`bar_${language}`);
    const pieIndex = headers.indexOf(`pie_${language}`);

    // Map the rows to the desired format
    const descriptions = rows.map(row => {
      const values = row.values;
      return {
        key: values[keyIndex]?.formattedValue,
        name: values[nameIndex]?.formattedValue,
        map: values[mapIndex]?.formattedValue,
        bar: values[barIndex]?.formattedValue,
        pie: values[pieIndex]?.formattedValue,
      };
    });

    // Filter out any rows that did not contain a key (which are required)
    return descriptions.filter(item => item.key != null);
  } catch (error) {
    console.error("Failed to get Descriptions from preloaded data: ", error);
    return [];
  }
}
// Usage:
// const descriptions = getDescriptions(preloadedSpreadsheetData, language);
// console.log(descriptions);


export function getConfiguration(preloadedSpreadsheet, language) {
  const SHEET_NAME = 'configuration'
  const configurationSheet = getSheetData(preloadedSpreadsheet, SHEET_NAME)

// If the sheet is not found, return an empty object
if (!configurationSheet) {
  console.warn(`Sheet with name '${SHEET_NAME}' not found.`);
  return {};
}

// Assuming the first element in the 'data' array contains the actual data
const rows = configurationSheet.data[0].rowData;

// Assuming the first row contains the header
const headers = rows.shift().values.map(cell => cell.userEnteredValue.stringValue);

// Find the index of the language column we are interested in
const keyIndex = headers.indexOf('key');
const langIndex = headers.indexOf(language);

// Reduce the rows into a configuration map object
const configurationMap = rows.reduce((map, row) => {
  // Assuming that each cell has a 'userEnteredValue' object with 'stringValue' for text
  const key = row.values[keyIndex]?.userEnteredValue?.stringValue;
  const translation = row.values[langIndex]?.userEnteredValue?.stringValue;

  // If key or translation is not defined, skip this row
  if (!key || !translation) return map;

  map[translation] = key;
  return map;
}, {});

return configurationMap;
}
// const configMap = getConfigurationByLanguage(preloadedSpreadsheetData, language);
// console.log(configMap);


export function getSections(configurationData, language) {
  if (!configurationData || !Array.isArray(configurationData)) {
    console.error('Invalid configuration data provided');
    return { sections: [], topic: null };
  }

  // Extract section names based on the provided language
  const sections = configurationData.map(item => item[language]);

  // // Determine the initial topic, which is the name of the first section
  // const topic = sections.length > 0 ? sections[0] : null;

  return  sections;
}


function transformData(rows) {
  if (!rows) {
    console.error("No data to transform.");
    return [];
  }

  var jsonData = [];
  var colsMap = {};

  // Map column indices to their respective headers
  rows[0].values.forEach((cell, idx) => {
    colsMap[idx] = cell.formattedValue;
  });

  // Transform each row into an object
  rows.slice(1).forEach(row => {
    var rowObject = {};
    row.values.forEach((cell, colIdx) => {
      rowObject[colsMap[colIdx]] = cell.formattedValue;
    });
    jsonData.push(rowObject);
  });

  return jsonData;
}

export function getSheetIdByYear(preloadedSpreadsheet, year) {
// Find the 'sheet_ids_by_year' sheet within the preloaded data
const sheetIdsByYear = getSheetData(preloadedSpreadsheet, 'sheet_ids_by_year')
if (!sheetIdsByYear) {
  console.error('Sheet "sheet_ids_by_year" not found.');
  return null;
}
const rows = sheetIdsByYear.data[0].rowData.slice(1); // Skip the header row
for (const row of rows) {
  const yearCell = row.values[0]?.formattedValue; // Assuming the year is in the first column
  const idCell = row.values[1]?.formattedValue; // Assuming the ID is in the second column
  if (yearCell && parseInt(yearCell, 10) === year) {
    console.log('idCell:',idCell);
    return idCell;
  }
}
console.error('Year not found in sheet.');
return null;
}
// // Example usage:
// const year = "2023";
// const sheetId = getSheetIdByYear(preloadedSpreadsheet, year);
// console.log(sheetId); // Should log the sheet ID corresponding to the year "2023"

export function createTopicsMap(preloadedSpreadsheetData) {

const SHEET_NAME = "configuration"; // This is the name of your sheet
let topicsMap = {};

// Find the configuration sheet from the preloaded data

const configurationSheet = getSheetData(preloadedSpreadsheetData, SHEET_NAME)
if (!configurationSheet) {
  console.warn(`Sheet with name '${SHEET_NAME}' not found.`);
  return {};
}

// Assuming the data is in the first 'data' element and the first row (header) has been skipped
const rows = configurationSheet.data[0].rowData.slice(1); // Skip the header row

rows.forEach(row => {
  // Assuming 'values' contains the cells in the order of [key, ru, en]
  const cells = row.values;
  const key = cells[0]?.formattedValue; // The key
  const ruTranslation = cells[1]?.formattedValue; // Russian translation
  const enTranslation = cells[2]?.formattedValue; // English translation

  // Map both translations to the same key
  if (key && ruTranslation) {
    topicsMap[ruTranslation] = key;
  }
  if (key && enTranslation) {
    topicsMap[enTranslation] = key;
  }
});

return topicsMap;
}
// Example usage:
// Assuming 'configurationData' is an array of objects representing your rows from the 'configuration' sheet.
// const topicsMap = createTopicsMap(configurationData);
// console.log(topicsMap);

export function getYears(preloadedSpreadsheet) {
  // Find the 'sheet_ids_by_year' sheet within the preloaded data
  const sheetIdsByYear = getSheetData(preloadedSpreadsheet, 'sheet_ids_by_year');
  if (!sheetIdsByYear) {
    console.error('Sheet "sheet_ids_by_year" not found.');
    return [];
  }

  const rows = sheetIdsByYear.data[0].rowData.slice(1); // Skip the header row
  const years = [];

  for (const row of rows) {
    const yearCell = row.values[0]?.formattedValue; // Assuming the year is in the first column
    if (yearCell && !isNaN(yearCell)) {
      years.push(parseInt(yearCell, 10));
      console.error('years:',years);
    }
  }

  if (years.length === 0) {
    console.error('No years found in sheet.');
  }

  return years;
}
