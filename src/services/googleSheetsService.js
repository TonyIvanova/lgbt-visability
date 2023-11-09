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
        var allUndef = Object.values(rowObject).reduce(
          function(acc, itm) {
            return  acc ||= itm === undefined
          }, false
        )
        if(!allUndef) { 
          jsonData.push(rowObject)
        }
      })
      return jsonData
    }

    function fillCachesWithTransformedWorksheetsData(data) {
        data.sheets.forEach( (sheet) => {
          dataCache[tableId+"_"+sheet.properties.title] = transformSheetRowsData(sheet.data[0].rowData)
          console.log(tableId+"_"+sheet.properties.title, dataCache[tableId+"_"+sheet.properties.title])
        })
    }

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
  
    return worksheetData;
  }

  export async function loadYearData(year, sheetName) {
    await loadConfiguration()
    return getSheetData(dataMap[year], sheetName)
  }

  export function getSections(lang) {
    return getSheetData(dataMap['configuration'], 'configuration').then(data => {
      return data.map((itm)=>[itm.key, itm[lang]])
    })
  }