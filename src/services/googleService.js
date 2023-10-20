// import { useYear } from "../contexts/yearContext";
import axios from 'axios';
import { useState } from 'react';

import { GoogleSpreadsheet } from "google-spreadsheet";

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const API_KEY = "AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM"; 
const CLIENT_EMAIL = 'gsheets@visibility-402008.iam.gserviceaccount.com';
const PRIVATE_KEY = {
    "type": "service_account",
    "project_id": "visibility-402008",
    "private_key_id": "20dbd277a52245aa95e9cbb2536e64dda3a36801",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCx0Kug2rFfY52J\n3DOB/n/YRzJIXrJ1FCKC/hqF34sX52agu33jlGZPk3t1I/gouccyijGKuDMsSiNb\nRlEZsc1zjUvkOVAb06xBejzUiHtlj9B8ZUhiWskiYO+7Y39rdjJOAnuMNBUh6iAi\nExyTxcuiJGFxJwvpkFTpMk+1na2tM0250sxzbezG3F/BpYte1LJPz0IJJDkMCYsj\nJSSbGIr5wjdRyuaQklQ5Kw/v48szphspxPi1pBcKyYJREp6yqOu5XuSjQspldFTL\nys4my36OWg1j33iAIwuLFMk+urLt6FUQjHHvA2nFz7K69FJ/tqlZJJzzNqyYNfRW\n5M9i6C91AgMBAAECggEAP/5bZj6Oi0fskIrhNq2DETE+VXFPRHeEnCQbI4b6JhYv\nhzUy706fK5BmZBgX3YBOwk+d2NDGCfB8nQLHeTnWOPnnEDHYNMuPONlnPw4HatvB\nKqPA0zTdIjRE0unSF7ioDg8yq5iq6lO6UMkUBdKvoKD7OJ/W164MAQkMSs5+jNBI\n8P0mbFpT3VsnVDlSpQh5msnISpWRh8BTSTs5p1TugAXPcV2rn2ihdIELjUxxRZG3\nHjMlb9G127C3ZBoKHCAe0dp3v0olEZD7z3MSb1BsZHMtVDQLuVKuhwRko8yuRGfa\nlgLxNx5ogfwUu5yX/9fvKEnz8Kv3xEMsurgd/qj4mQKBgQD0avvIoSTgUiguumTy\nGyqrLqzck5wTuYgAJABcHwoArCcJbeEK02qUNQMiTbphQyWjSoKG7zYsOV3MoeaQ\nBc818/4S+mCyxejUFraS/lwGMbHCHEP/5PPt0YMALeUUk0x6h54CHkTV4JR2UGmI\nlp4lZingm8+Db4UI2hXWLaBjNwKBgQC6Pbuw8kvTLCU3cFq5tq5+I7ln3VyZRV/X\nWQe08QijNp0/TxKi9heRgX3ILwuf4hlOLB+81IboC8PacsmF+rxJJT9fIcv32J05\nHD8gfyCFqMqStIAZL4JNT8cEQsUOB1usthEn6yUsPIijYSvzm0CZTqOvWnb7IsxN\n6WzTJVuwswKBgD/jszsnfEcy0pQcXwS2OzoR8leaMiMpzTYUMw/hgTDZzz50vW2i\nA+sHzHDsFnsUHUOI14PEBcobmLxD2cvt6NM2m0SEtEAm4YyG/2R/Hrjzxn5x+whp\n5aVVrcOfO5FcS5J/3rq5BM9PbB9dN6jfjilCglHXCLBXt1OwBiM9O/6TAoGBALIr\npujUE/g1TnFoGlN60ho4wQH9gr3a4aKaOMZApVvHPs43LoQaXFfGgvfFEiDl5AGm\nMsKqq1lJEBhnIiX7xq9PY/31zjUQ1PCy9i13kTxtS0boSXhOvCCMRr/rxKr0HR7w\nmx8OVWSpkKqEptCJ4VYJJoz2Rcdh9gQ/YO3q2noDAoGAL9CzOjKws/KvJ3aM+msp\nvimaLbLrYmuNzKhGiQlfAQhHsNG7yu5TIvPobPWnNQGYTpEHBT5Tb+vUNQoxzpNG\nIslNmHDZAD6upfVZAJcr7I5EfYfQeFymxyzEt8Wn8XZ924N7myD/4WOBCbN8uWiZ\nshHpoQLfIsP1bKXssX95JGs=\n-----END PRIVATE KEY-----\n",
    "client_email": "gsheets@visibility-402008.iam.gserviceaccount.com",
    "client_id": "117457394469976031904",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gsheets%40visibility-402008.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  

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

// const {google} = require('googleapis');
// const auth = new google.auth.GoogleAuth({
//     keyFile: 'path_to_your_downloaded_JSON_file.json',
//     scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//   });


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