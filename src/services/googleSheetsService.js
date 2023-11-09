// import { useYear } from "../contexts/yearContext";
// const { year, setYear } = useYear();

export const dataMap = {
    'configuration': '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE',
  }

var dataCache = {}

async function loadConfiguration() {
  var configData = await getSheetData(dataMap['configuration'], 'sheet_ids_by_year')
  configData.forEach(function(itm) {
      dataMap[itm.year] = itm.id
    }
  )
}

export async function getSheetData(tableId, sheetName) {
    const API_KEY = 'AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM';
    console.log("Geting "+ sheetName + " from " + tableId)

    if(dataCache[tableId+"_"+sheetName]) {
        return new Promise((resolve, reject) => {
            resolve(dataCache[tableId+"_"+sheetName]);
        })
    }

    if(tableId != dataMap['configuration']){
      await loadConfiguration()
    }

    // transforms [{values: [{userEnteredValue: {…}, effectiveValue: {…}, formattedValue: 'Дальневосточный федеральный округ', effectiveFormat: {…}}], ...]
    function transformSheetRowsData(rowData) {
      if(!rowData) {
        debugger
        return
      }
      var colsMap = {}
      var jsonData = []
      if(!rowData) {
        return jsonData
      }
      console.log(rowData)

      // extracts first row
      rowData[0].values.forEach( (item, idx) => {
        colsMap[idx] = item.formattedValue
      })

      // transforms {userEnteredValue: {…}, effectiveValue: {…}, formattedValue: 'Дальневосточный федеральный округ', effectiveFormat: {…}}
      // to { columnName1: formattedValue, ... }
      rowData.forEach( (row, rowIdx) => {
        if(rowIdx == 0) return;
        var rowObject = {}
        row.values.forEach((cellValue, colIdx) => {
            rowObject[colsMap[colIdx]] = cellValue.formattedValue;
        })
        jsonData.push(rowObject)
      })
      return jsonData
    }

    function fillCachesWithTransformedWorksheetsData(data) {
        if(!data) {
          debugger
          return
        }
        console.log(data)
        data.sheets.forEach( (sheet) => {
          console.log(sheet)
          dataCache[tableId+"_"+sheet.properties.title] = transformSheetRowsData(sheet.data[0].rowData)
        })
    }

    const worksheetData = new Promise((resolve, reject) => {
      console.log("Querying API for "+ sheetName +" in " + tableId)
      return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/?key=${API_KEY}&includeGridData=true`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            fillCachesWithTransformedWorksheetsData(data)
            resolve(dataCache[tableId+"_"+sheetName])
            return dataCache[tableId+"_"+sheetName]
        })
    });
  
    return worksheetData;
  }

  export async function loadYearData(year, sheetName) {
    await loadConfiguration()
    return getSheetData(dataMap[year], sheetName)
  }

  export async function getSections(lang) {
    await loadConfiguration()
    return getSheetData(dataMap['configuration'], 'configuration').then(data => {
      return data.reduce(function(acc, itm) {
       acc[itm.key]=itm[lang];
       return acc
      }, {})
    })
  }

  export async function getConclusions(year, lang) {
    await loadConfiguration()
    return getSheetData(dataMap[year], 'conclusions').then(data => {
      return data.reduce(function(acc, itm) {
       acc[itm.key] ||= {}
       acc[itm.key]['name']=itm["name_"+lang];
       acc[itm.key]['text']=itm["text_"+lang];
       return acc
      }, {})
    })
  }