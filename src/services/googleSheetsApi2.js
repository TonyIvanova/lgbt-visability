
//googleSheetsApi.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; 
const CONFIG_SPREADSHEET_ID = process.env.REACT_APP_CONFIG_SPREADSHEET_ID; 

const useSpreadsheetData = (spreadsheetId) => {
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadSpreadsheet = async () => {
        try {
          const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
            params: {
              key: API_KEY,
              includeGridData: true, // Set to true if you want the cells' data
            },
          });
          setSpreadsheetData(response.data);
          console.log('Spreadsheet data loaded:', response.data); 
        } catch (err) {
          setError(err);
          console.error('Error loading spreadsheet:', err);
        } finally {
          setLoading(false);
        }
      };
  
      if (spreadsheetId) {
        loadSpreadsheet();
      }
    }, [spreadsheetId]);
  
    // console.log('spreadsheetData:',spreadsheetData)
    return { spreadsheetData, loading, error };
  };
  
  export default useSpreadsheetData;

export function findSheetByName(sheets, name) {
    return sheets.find(sheet => sheet.properties.title === name);
  }
  

export function getDataMap(sheetName) {
    const sheet = findSheetByName(preloadedSpreadsheet.sheets, sheetName);
    if (!sheet) {
      console.error(`Sheet with name ${sheetName} not found.`);
      return {};
    }
    let tempDataMap = {};
    // Assuming the first row is headers and data starts from the second row
    for(let i = 1; i < sheet.data[0].rowData.length; i++) {
      let row = sheet.data[0].rowData[i].values;
      let year = row[0].formattedValue;
      let sheetId = row[1].formattedValue;
      tempDataMap[year] = { report: { sheet: sheetId } };
    }
    return tempDataMap;
  }


export async function getDescriptions(language = "ru") {
  const SHEET_ID= "descriptions";
  try {
    // Here you would call the previously adjusted function that works with the preloaded data.
    const data = await getSheetData(SHEET_ID);
    console.log('getDescriptions: ', data)
    return data.map((item) => ({
      key: item.key,
      name: item[`name_${language}`],
      map: item[`map_${language}`],
      bar: item[`bar_${language}`],
      pie: item[`pie_${language}`],
    }));
  } catch (error) {
    console.error("Failed to get Descriptions from preloaded data: ", error);
    return [];
  }
}

  export function getSheetData(sheetName) {
    const sheet = findSheetByName(preloadedSpreadsheet.sheets, sheetName);
    if (!sheet) {
      console.error(`Sheet with name ${sheetName} not found.`);
      return Promise.resolve([]);
    }
    const jsonData = transformData(sheet.data[0].rowData);
    return Promise.resolve(jsonData);
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