// googleSpredsheetService.js

const API_KEY = process.env.REACT_APP_API_KEY;

// Object for mapping spreadsheets to their ids in Google Drive
export const dataMap = {
  'config': process.env.REACT_APP_CONFIG_SPREADSHEET_ID
}


// Cache object for storing fetched data to reduce API calls
var dataCache = {}

const DEF_DELAY = 100;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

// get from config/sheet_ids_by_year:  year -> id
async function loadConfig() {
  console.log("loadConfig")
  var configData = await getSheetData(dataMap['config'], 'sheet_ids_by_year')
  configData.forEach(function (itm) {
    dataMap[itm.year] = itm.id
    // console.log('GSHEETS/dataMap:',dataMap)\
    console.log('loadConfig/ itm',itm)
  }
  
  )
}

//  retrieve data from a gsheet and cache it
export async function getSheetData(tableId, sheetName) {
  var loader = false
  // console.log("getSheetData " + tableId + "  " + sheetName)
  // Check if is in cache first 
  if (dataCache[tableId] == undefined) {
    loader = true
    dataCache[tableId] = 'loading'
  } else {
    while (dataCache[tableId] == 'loading') {
      await sleep()
    }
  }
  if ((dataCache[tableId + "_" + sheetName] && typeof dataCache[tableId + "_" + sheetName] == 'object')) {
    dataCache[tableId] = "loaded"
    return new Promise((resolve, reject) => { // returns a Promise that resolves to the requested data
      resolve(dataCache[tableId + "_" + sheetName]);
    })
  }


  // To transform the raw sheet data into a more usable JSON format
  function transformSheetRowsData(rowData) {
    var colsMap = {}
    var jsonData = []
    if (!rowData) {
      return jsonData
    }
    // console.log('getSheetData/rowData',rowData)

    // extracts first row
    rowData[0].values.forEach((item, idx) => {
      colsMap[idx] = item.formattedValue
    })

    // transforms {userEnteredValue: {…}, effectiveValue: {…}, formattedValue: 'Дальневосточный федеральный округ', effectiveFormat: {…}}
    // to { columnName1: formattedValue, ... }
    rowData.forEach((row, rowIdx) => {
      if (rowIdx === 0) return;
      var rowObject = {}
      row.values.forEach((cellValue, colIdx) => {
        rowObject[colsMap[colIdx]] = cellValue.formattedValue;
      })
      var allUndef = Object.values(rowObject).reduce(
        function (acc, itm) {
          return acc &&= itm === undefined
        }, true
      )
      if (!allUndef) {
        jsonData.push(rowObject)
      }
    })
    console.log('getSheetData/ jsonData:',jsonData)
    return jsonData
  }

  // iterate sheets
  function fillCachesWithTransformedWorksheetsData(data) {
    // console.log(data)
    if (!data || !Array.isArray(data.sheets)) {
      console.error('Data is not in the expected format:', data);
      return; // or throw an error
    }
    data.sheets.forEach((sheet) => {//for each sheet in a spreadsheet
      // console.log('getSheetData/ sheet',sheet)
      dataCache[tableId + "_" + sheet.properties.title] = transformSheetRowsData(sheet.data[0].rowData)
    })
  }

  function waitForCacheAndExec(tableId, sheetName, func) {
    console.log("Waiting for cache on ", tableId, sheetName)
    var myInterval = null
    const waitFunc = function () {
      if (dataCache[tableId + "_" + sheetName] && dataCache[tableId] == 'loaded' || loader) {
        clearInterval(myInterval)
        return func()
      }
    }
    myInterval = setInterval(waitFunc, 50);
  }

  function fetchData(tableId, resolve, reject) {
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/?key=${API_KEY}&includeGridData=true`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log('getSheetData/ API response:', tableId);
        fillCachesWithTransformedWorksheetsData(data)
        dataCache[tableId] = 'loaded'
        resolve(dataCache[tableId + "_" + sheetName])
        return dataCache[tableId + "_" + sheetName]
      })
  }

  // get data from each sheet
  const worksheetData = new Promise((resolve, reject) => {
    // console.log("promise")
    return waitForCacheAndExec(tableId, sheetName, function () {
      if (typeof dataCache[tableId + "_" + sheetName] == 'object') {
        resolve(dataCache[tableId + "_" + sheetName])
      } else {
        fetchData(tableId, resolve, reject)
      }
    })


  });
  // console.log('worksheetData/ dataCache:',dataCache)
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
    getSheetData(spreadsheetId, "economical_status")
    // console.log('loadYearData/ dataCache:',dataCache)
    return 'All sheets data fetched and stored in cache.';
  } catch (error) {
    // console.error(`Error fetching data for year ${year}:`, error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
}

export async function getSections(language) {
  await loadConfig()
  return getSheetData(dataMap['config'], 'configuration').then(data => {
    return data.map((itm) => itm[language])
  })
}


//TODO: doesnt see topicKey passed]
export async function getDescriptions(language, topicKey = 'violence') {
  // console.log('Loading configuration...');
  await loadConfig();
  // console.log(`Fetching descriptions for language: ${language} and topic: ${topicKey}...`);

  return getSheetData(dataMap['config'], 'descriptions').then(data => {
    // console.log('Raw descriptions data fetched:', data);

    // Filter out the row where `key` equals `topicsMap[topic]`
    const filteredData = data.filter(itm => itm.key === topicKey)
    // console.log(`Filtered descriptions data, removed topic ${topicKey}:`, filteredData);

    const descriptions = filteredData.map(itm => ({ // Map over each item and transform it into an object
      key: itm.key,
      bar: itm[`bar_${language}`],
      map: itm[`map_${language}`],
      name: itm[`name_${language}`],
      pie: itm[`pie_${language}`]
    }));

    // Log the final descriptions object after reduce
    // console.log(`Processed ${topicKey} descriptions:`, descriptions);

    return descriptions;
  }).catch(error => {
    // Log and throw any errors encountered during the fetch
    console.error('Error fetching descriptions:', error);
    throw error;
  });
}


export async function getConclusions(year, language, topicKey = 'economical_status') {
  // console.log(`Loading conclusions for year: ${year}, language: ${language}...`);
  await loadConfig();
  return getSheetData(dataMap[year], 'conclusions').then(data => {
    // console.log('Raw conclusions data fetched:', data);

    // Filter out rows that do not match the topicKey or where the 'text' field for the language is empty
    const filteredData = data.filter(itm => itm.key === topicKey && itm["text_" + language]?.trim());

    // Reduce the filtered data into an array of conclusion objects
    const conclusions = filteredData.map(itm => ({
      name: itm["name_" + language],
      text: itm["text_" + language]
    }));

    // console.log('Processed conclusions:', conclusions);
    return conclusions;
  }).catch(error => {
    console.error('Error fetching conclusions:', error);
    throw error;
  });
}

export async function getStories(year, language, topicKey) {
  // console.log(`Loading stories for year: ${year}, language: ${language}...`);
  await loadConfig();

  return getSheetData(dataMap[year], 'stories_filtered').then(data => {
    //TODO: remove df_ prefix everywhere
    // console.log('Raw stories data fetched:', data);
    // console.log('GetStories/lang:', language);
    // console.log('GetStories/year:', year);
    // // Filter out rows that match the topicKey\
    // console.log('GetStories/topicKey:', topicKey);


    const filteredData = data.filter(itm => itm.key === topicKey);
    // console.log('Filtered stories data:', filteredData);

    // Map the filtered data into an array of story objects
    const stories = filteredData.map(itm => ({
      // name: itm["name_" + language],
      text: itm["text_" + language],
      author: itm["author_" + language]
    }));

    // console.log('Processed stories:', stories);
    return stories;
  }).catch(error => {
    console.error('Error fetching stories:', error);
    throw error;
  });
}


export async function getSampleData(year) {
  // console.log(`Loading sample for year: ${year}`);
  await loadConfig();

  return getSheetData(dataMap[year], 'sample').then(data => {

    // console.log('getSampleData/ sample data:', data);

    // Map the filtered data into an array of sample objects
    const sample = data.map(itm => ({
      key: itm.key,
      value: itm.value
    }));

    // console.log('getSampleData/ Processed sample:', sample);
    return sample;
  }).catch(error => {
    console.error('Error fetching sample data:', error);
    throw error;
  });
}


// export async function getConfiguration(language) {
//   await loadConfig()
//   return getSheetData(dataMap['config'], 'configuration').then(data => {

//     const res = data.map(itm => ({
//       key: itm[key],
//       name: itm[language]

//     }));

//     // console.log('Processed stories:', stories);
//     return res;

//   }).catch(error => {
//     console.error('Error fetching stories:', error);
//     throw error;
//   });
// }




export async function makeTopicsMap() {
  await loadConfig()
  return getSheetData(dataMap['config'], 'configuration').then(data => {

    const topicsMap = {};

    return data.reduce(function (itm) {

      // Build the map by iterating over the configuration data
      data.forEach((item) => {
        // For each configuration item, map both the English and Russian terms to the key
        topicsMap[item['ru']] = item.key;
        topicsMap[item['en']] = item.key;
      });

      // console.log('makeTopicsMap:',topicsMap)
      return topicsMap;

    }, {})
  })
}





export async function getYears() {
  await loadConfig();

  return getSheetData(dataMap['config'], 'sheet_ids_by_year').then(data => {
    // console.log('getYears/ data:', data);
    // Assuming each item in the data array has a 'year' property
    const years = data.map(itm => itm.year); // Collect all the 'year' values

    // console.log('getYears/ Processed years:', years);
    return years; // Return the array of years
  }).catch(error => {
    console.error('Error fetching years:', error);
    throw error; // Propagate the error
  });
}


export async function getFullReportLink(year, language) {
  console.log(`Loading full report link for year: ${year}, language: ${language}...`);
  await loadConfig();
  console.log('loaded config')
  return getSheetData(dataMap['config'], 'sheet_ids_by_year').then(data => {
    console.log('Raw sheet data fetched:', data);

    // Find the row that matches the given year
    const matchedRow = data.find(itm => itm.year === year);

    if (!matchedRow) {
      console.error('No data found for the given year:', year);
      throw new Error('No data found for the given year');
    }

    // Select the appropriate report link based on the language
    const reportLinkKey = `full_report_${language}`;
    const reportLink = matchedRow[reportLinkKey];
    console.log('reportLinkKey', reportLinkKey);
    console.log('reportLink', reportLink);
    if (!reportLink) {
      console.error(`No report link found for the language: ${language}`);
      throw new Error(`No report link found for the language: ${language}`);
    }

    console.log(`Full report link for year ${year}, language ${language}:`, reportLink);
    return reportLink;
  }).catch(error => {
    console.error('Error fetching full report link:', error);
    throw error;
  });
}



//TODO: maybe refactor so that map data is fetche for all columns
//and from it them preselected based on selected Question
export async function getMapData(year, sheetName, selectedQuestion) {
  try {
    await loadConfig();
    // console.log(`Fetching mapData for year: ${year}, sheetName: ${sheetName}`);
    // console.log('getMapData/selectedQuestion', selectedQuestion);

    const data = await getSheetData(dataMap[year], sheetName);
    // console.log('getMapData/Raw data fetched:', data);

    const mapData = data
      .map(row => {
        
        // console.log('rgetMapData/ selectedQuestion:',selectedQuestion)
        // console.log('rgetMapData/ row[selectedQuestion]:',row[selectedQuestion])
        const value = parseFloat(row[selectedQuestion]) //|| 0; // Parse the value
        return { name: row.District, value: value };
      })
      .filter(item => item.name !== 'All districts'); // Exclude 'All districts' from the results

    // console.log('getMapData:', mapData);
    return mapData;
  } catch (error) {
    console.error('Error fetching map data:', error);
    throw error; // Re-throw the error to handle it further up the call chain
  }
}


//TODOP: get opennes map data

export async function getBarData(year, sheetName) {
  await loadConfig();
  return getSheetData(dataMap[year], sheetName).then(data => {
    // Find the row where the district is 'All districts'
    const rowVse = data.find(row => row.District === 'All districts');

    // Check if row exists and create an array of objects with name and value properties
    if (rowVse) {
      // Create a result array excluding the 'District' and 'All questions' properties
      const barData = Object.entries(rowVse).reduce((acc, [key, value]) => {
        if (key !== 'District' && key !== 'All') {
          acc.push({
            name: key,
            value: parseFloat(value) || 0 // Ensuring the value is a number
          });
        }
        return acc;
      }, []);
      // console.log('barData:', barData)
      return barData;
    } else {
      // Handle the case where no 'All districts' row is found
      throw new Error("Row 'All districts' not found.");
    }
  });
}


export async function getPieData(year, sheetName) {
  await loadConfig();
  return getSheetData(dataMap[year], sheetName).then(data => {
    // Find the row where the district is 'All districts'
    const rowVse = data.find(row => row.District === 'All districts');

    // Check if row exists and create an array of objects with name and value properties
    if (rowVse) {
      // Create a result array excluding the 'District' and 'All questions' properties
      const pieData = Object.entries(rowVse).reduce((acc, [key, value]) => {
        if (key !== 'District' && key !== 'All') {
          acc.push({
            name: key,
            value: parseFloat(value) || 0 // Ensuring the value is a number
          });
        }
        return acc;
      }, []);
      // console.log('pieData:', pieData)
      return pieData;
    } else {
      // Handle the case where no 'All districts' row is found
      throw new Error("Row 'All districts' not found.");
    }
  });
}