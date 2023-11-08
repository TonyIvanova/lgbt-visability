
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
