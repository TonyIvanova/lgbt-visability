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

export async function getSections(language) {
  await loadConfig()
  return getSheetData(dataMap['config'], 'configuration').then(data => {
    return data.map((itm)=>[itm.key, itm[language]])
  })
  // return getSheetData(dataMap['config'], 'configuration').then(data => {
  //   return data.reduce(function(acc, itm) {
  //    acc[itm.key]=itm[lang];
  //    console.log('Sections:',acc)
  //    return acc
  //   }, {})
  // })
}


export async function getDescriptions(language) {
  await loadConfig()
  return getSheetData(dataMap['config'], 'descriptions').then(data => {

    return data.reduce(function(acc, itm) {
        acc[itm.key]['key']||= {}
        acc[itm.key]['name']=itm["name_"+language];
        acc[itm.key]['bar']=itm["bar_"+language];
        acc[itm.key]['map']=itm["map"+language];
        acc[itm.key]['pie']=itm["pie_"+language];
        console.log('descriptions:',acc)
        return acc
    }, {})
  })
}



export async function getConclusions(year, language) {
  await loadConfig()
  return getSheetData(dataMap[year], 'conclusions').then(data => {
    return data.reduce(function(acc, itm) {
     acc[itm.key] ||= {}
     acc[itm.key]['name']=itm["name_"+language];
     acc[itm.key]['text']=itm["text_"+language];
     console.log('Conclusions:',acc)
     return acc
    }, {})
  })
}

//TODO: filted out empty rows 

export async function getStories(year, language) {
  await loadConfig()
  return getSheetData(dataMap[year], 'df_stories_filtered').then(data => {
    return data.reduce(function(acc, itm) {
     acc[itm.key] ||= {}
     acc[itm.key]['name']=itm["name_"+language];
     acc[itm.key]['text']=itm["text_"+language];
     acc[itm.key]['author']=itm["author_"+language];
     console.log('Stories:',acc)
     return acc
    }, {})
  })
}



export async function getConfiguration(language) {
  await loadConfig()
  return getSheetData(dataMap['config'], 'configuration').then(data => {

    return data.reduce(function(acc, itm) {
        acc[itm.key]['key']||= {}
        acc[itm.key]['name']=itm[language];
        console.log('Configuration:',acc)
        return acc
    }, {})
  })
}



export async function makeTopicsMap() {
  await loadConfig()
  return getSheetData(dataMap['config'], 'configuration').then(data => {

    return data.reduce(function(itm) {
       
  const topicsMap = {};

  // Build the map by iterating over the configuration data
  data.forEach((item) => {
    // For each configuration item, map both the English and Russian terms to the key
    topicsMap[item['ru']] = itm.key;
    topicsMap[item['en']] = itm.key;
  });

  console.log('topicsMap:',topicsMap)
  return topicsMap;

    }, {})
  })
}

export const topicsMap = makeTopicsMap()


export async function getMapData(year, sheetName
   ) {
  await loadConfig()
 return getSheetData(dataMap[year],sheetName).then(data => {
  const mapData = data.map(row => {
    return {
      name: row.District,
      value: parseFloat(row.All) || 0 // Ensuring the value is a number, defaulting to 0 if not
    };
  }).filter(item => item.name !== 'Все'); // Exclude 'Все'
    })
}

// function parseMapData(res) {
//   if (!res || res === undefined || res?.length === 0) {
//     console.info("Failed to parse Map Data. Response is empty.");
//     return [];
//   }
//   const result = res.map((row) => {
//     return {
//       name: row.District,
//       value: parseFloat(row[selectedQuestion]),
//     };
//   });
//   return result;
// };

 //TODOP: get opennes map data

export async function getBarData(year, sheetName) {
  await loadConfig();
  return getSheetData(dataMap[year], sheetName).then(data => {
    // Find the row where the district is 'Все'
    const rowVse = data.find(row => row.District === 'Все');

    // Check if row exists and create an array of objects with name and value properties
    if (rowVse) {
      // Create a result array excluding the 'District' and 'All' properties
      const barData = Object.entries(rowVse).reduce((acc, [key, value]) => {
        if (key !== 'District' && key !== 'All') {
          acc.push({
            name: key,
            value: parseFloat(value) || 0 // Ensuring the value is a number
          });
        }
        return acc;
      }, []);
      console.log('barData:',barData)
      return barData;
    } else {
      // Handle the case where no 'Все' row is found
      throw new Error("Row 'Все' not found.");
    }
  });
}
// if (!res || res === undefined || res?.length === 0) {
// function parseBarData(res) {
//   if (!res || res === undefined || res?.length === 0) {
//     console.info("Failed to parse bar data. The response is empty.");
//     return [];
//   }
//   const fields = Object.keys(res[0])
//     .filter((key) => key !== "District" && key !== "All")
//     .map((key) => {
//       return key;
//     });
//   const values = res.find((row) => row.District === "Все");
//   const result = fields.map((field) => {
//     return { name: field, value: parseFloat(values[field]) };
//   });
//   return result;
// };



export async function getPieData(year, sheetName) {
  await loadConfig();
  return getSheetData(dataMap[year], sheetName).then(data => {
    // Find the row where the district is 'Все'
    const rowVse = data.find(row => row.District === 'Все');

    // Check if row exists and create an array of objects with name and value properties
    if (rowVse) {
      // Create a result array excluding the 'District' and 'All' properties
      const pieData = Object.entries(rowVse).reduce((acc, [key, value]) => {
        if (key !== 'District' && key !== 'All') {
          acc.push({
            name: key,
            value: parseFloat(value) || 0 // Ensuring the value is a number
          });
        }
        return acc;
      }, []);
console.log('pieData:',pieData)
      return pieData;
    } else {
      // Handle the case where no 'Все' row is found
      throw new Error("Row 'Все' not found.");
    }
  });
}
// function parsePieData(res) {
//   if (!res || res === undefined || res?.length === 0) {
//     console.info("Failed to parse Pie Data. Response is empty.");
//     return [];
//   }
//   const fields = Object.keys(res[0])
//     .filter((key) => key !== "District" && key !== "All")
//     .map((key) => {
//       return key;
//     });
//   const values = res.find((row) => row.District === "Все");
//   const result = fields.map((field) => {
//     return { name: field, value: parseFloat(values[field]) };
//   });
//   return result;
// };



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
// }



 