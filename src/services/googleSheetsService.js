export const dataMap = {
    '2022': {
      'report':{
        'sheet': '1Sxztfp24OnyH-TchGXBKV4R1Tm0jQk8Xd4qOQ9JFfd0',
      }
    }
  }

var dataCache = {}

export function getSheetData(tableId, sheetName) {
    const API_KEY = 'AIzaSyD71dPGb38J0b2Y4XC7tShKP0JQ_H9rGPM';

    if(dataCache[tableId+"_"+sheetName]) {
        return new Promise((resolve, reject) => {
            resolve(dataCache[tableId+"_"+sheetName]);
        })
    }
    function transformData(data) {
        var jsonData = []
        var colsMap = {}
        data[0].forEach( (item, idx) => {
            colsMap[idx] = item
        })
        data.forEach( (row, rowIdx) => {
            if(rowIdx == 0) return;
            var rowObject = {}
            row.forEach((cellValue, colIdx) => {
                rowObject[colsMap[colIdx]] = cellValue;
            })
            jsonData.push(rowObject)
        })
        return jsonData;
    }

    const tableData = new Promise((resolve, reject) => {
      return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${tableId}/values/${sheetName}?key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            dataCache[tableId+"_"+sheetName] = transformData(data.values)
            resolve(dataCache[tableId+"_"+sheetName])
            return
        })
    });
  
    return tableData;
  }
  