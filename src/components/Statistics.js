import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import {PieChart,PieChart2} from "./shared/PieChart";
import { 
  getConfiguration, 
  getSheetData, 
  getFullSpreadsheetData 
} from ".././services/googleSheetsService";
import {ButtonGroupLang} from "./shared/ButtonGroup";
// import {useDataMap} from "../contexts/dataContext"
import {useYear} from "../contexts/yearContext"
import { 
  useConfiguration,   
  useDescriptions,
  useData,
  useWhichSubset,
  useDataMap
 } from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";


export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const {dataMap} = useDataMap()
  const {year} = useYear()
  const {language} = useLanguage()
  // console.log(dataMap)
  const [chartDescription, setChartDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("All");

  // const topicsMap = {
  //   'Экономическое положение': 'economical_status',
  //   'Насилие':'violence',
  //   'Дискриминация':'discrimination',
  //   'Влияние войны в Украине':'war_effects',
  //   'Открытость': 'opennes'
  // }
  const configuration = getConfiguration()
  const topicsMap = Object.entries(configuration).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});   
console.log(topicsMap);


// TODO: change to fetConfiguration(language)

  useEffect(() => {
    console.log("Statistics/chartData:", chartData);
    console.log("Statistics/ mapDescription:", mapDescription);
    console.log('Statistics/selectedQuestion[year]: ',selectedQuestion)
}, [chartData, mapDescription,selectedQuestion]);

  
// TODO: change to  useDescriptions[lang]
  useEffect(() => {
    // Get row (topic) from preloaded config.xlsx/descriptions, by language (column)
    setSelectedQuestion("All");
    const descriptions = useDescriptions()
    console.log('Statistics/descr',descriptions)
    // setDescriptions(descr[topic])
  }, [language]);


  useEffect(() => {
    // getSheetData(dataMap[year]['report']['sheet'], topicsMap[topic]).then((res) => {
      getSheetData('16rkG1h_82MCuImvFkvV8P7N5TsJw5S49avmCuUG3HQ',
      topicsMap[topic]).then((res) => {
      console.log('res:',res)
      setChartData(parseChartData(res));
      setMapData(parseMapData(res));
    });
  }, [topic, selectedQuestion, year]);


  const setDescriptions = (res) => {
    const relevantTopic = res.find((value) => value.Name === topic);
    setChartDescription(relevantTopic?.Pie);
    setMapDescription(relevantTopic?.Map);
  };

  const parseChartData = (res) => {
    if (res?.length === 0) return [];
    const fields = Object.keys(res[0])
      .filter((key) => key !== "District" && key !== "All")
      .map((key) => {
        return key;
      });
    const values = res.find((row) => row.District === "Все");
    const result = fields.map((field) => {
      return { name: field, value: parseFloat(values[field]) };
    });
    return result;
  };

  const parseMapData = (res) => {
    const result = res.map((row) => {
      return {
        name: row.District,
        value: parseFloat(row[selectedQuestion]),
      };
    });
    return result;
  };

  const handleArcClick = (arcName) => {
    setSelectedQuestion(arcName);
  };

  if (chartData && mapData) {
    return (
      <div className="section">
        <div>
 
        <ButtonGroupLang 
          buttons={['cisgender','transgender','all']}/>
          <Map statistics={mapData} />
          <p className="statistics-description">
            {selectedQuestion !== "All"
              ? "Процент респондентов которые сталкивались с: " + ""
              : mapDescription}
            <h3 style={{ margin: 0 }}>
              {selectedQuestion !== "All" ? selectedQuestion : ""}
            </h3>

            <br />
          </p>
        </div>

        <div>
        {topic === "Открытость" ? (
          <div>
          <ButtonGroupLang buttons={['Семья','Друзья','Коллеги/однокурсники']}/>
          <PieChart data={chartData} onArcClick={handleArcClick} />
          </div>
        ):(
          <PieChart data={chartData} onArcClick={handleArcClick} />
        )
         }
          <p className="statistics-description">{chartDescription}</p>
        </div>
      </div>
    );
  }
}
