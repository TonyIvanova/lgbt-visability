import { useYear } from "../contexts/yearContext";

export default async function getData(year) {
    const { year, setYear } = useYear();

    // spreadsheetId based on selected year
    if (year == '2023')
    {const spreadsheetId = '1sPD_8M_X4Bm3YwQKdI6yobC7nlvV8gygkfViE5lekaM'}
    else //2022 default
    {const spreadsheetId = '1izL48ioAQQizdUGssrOSMZibA5JMwO6WBlCHuk64Gbw';}
    
    const sheetNames = [
        'map_economy', 
        'map_violence', 
        'map_discrimination',
        'map_wareffect'
    ]; 
    
    // Create an array to hold data from all sheets
    let allData = [];

    for (const sheetName of sheetNames) {
        try {
            const response = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetName}&tqx=out:json`);
            if (!response.ok) {
                console.error('Network response was not ok' + response.statusText);
                return;  // or throw, or continue, depending on desired error handling
            }
            const result = await response.text();
            const json = JSON.parse(result.replace(/.*google.visualization.Query.setResponse\({(.*?)}\);?/s, '{$1}'));

            const headings = json.table.cols.map(item => item.label);
            let data = json.table.rows.map(item => {
                let row = {};
                item.c.forEach((cell, idx) => {
                    row[headings[idx]] = cell?.v ?? null;
                });
                return row;
            });

            // Do something with `data` here
            allData.push({[sheetName]: data});

        } catch (error) {
            console.error('Fetching or parsing failed', error);
            // handle error 
        }
    }

    return allData; 
}


export function getSheetData(sheetName) {
    // Check if yearData contains the sheetName as a property
    if (yearData.hasOwnProperty(sheetName)) {
        // Return the data associated with sheetName
        return yearData[sheetName];
    }

    console.warn(`Sheet "${sheetName}" not found in yearData`);
    
    // Return an empty array if the sheet is not found
    return [];
}