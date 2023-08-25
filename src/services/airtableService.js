export function getAirtableData(tableName) {
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE }).base(
    "appOzHt3RKybzSlOM"
  );

  const tableData = new Promise((resolve, reject) => {
    let data = [];

    base(tableName)
      .select({
        maxRecords: 100,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          data.push(records.map((record) => record.fields));
          fetchNextPage();
        },
        function done(err) {
          resolve(data);
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
        }
      );
  });

  return tableData;
}
