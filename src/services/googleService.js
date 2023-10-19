// import { useYear } from "../contexts/yearContext";
import axios from 'axios';
import { useState } from 'react';


const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const API_KEY = "AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM"; 

function getSpreadsheetIdByYear(year) {
    const mapping = {
        '2022': '1izL48ioAQQizdUGssrOSMZibA5JMwO6WBlCHuk64Gbw',
        '2023': '1sPD_8M_X4Bm3YwQKdI6yobC7nlvV8gygkfViE5lekaM',
        '2024': '',
        '2025': '',
        '2026': '',
        '2027': '',
    };
    return mapping[year];
}


function getData(year) {
    const SHEET_ID = getSpreadsheetIdByYear(year);
    const metadataUrl = `${BASE_URL}/${SHEET_ID}?fields=sheets.properties.title&key=${API_KEY}`;
    
    return axios.get(metadataUrl)
        .then(response => {
            const sheetNames = response.data.sheets.map(sheet => sheet.properties.title);
            return Promise.all(sheetNames.map(sheetName => fetchDataFromSheet(SHEET_ID, sheetName)));
        })
        .then(allData => allData.flat())
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; // You can handle the error or re-throw it.
        });
}

export default getData;

function fetchDataFromSheet(sheetId, sheetName) {
    const url = `${BASE_URL}/${sheetId}/values/${sheetName}?valueRenderOption=FORMATTED_VALUE&key=${API_KEY}`;
    return axios.get(url)
        .then(response => formatResponse(response.data))
        .catch(error => {
            console.error("Error fetching data from sheet:", error);
            throw error;
        });
}

function formatResponse(response) {
    const keys = response.values[0];
    const data = response.values.slice(1);
    return data.map(arr => Object.assign({}, ...keys.map((k, i) => ({ [k]: arr[i] }))));
}

export function getSheetData(yearData, sheetName) {
    return yearData[sheetName] || [];
}