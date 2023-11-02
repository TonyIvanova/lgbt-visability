import React, { useState, useEffect, useMemo } from "react";
import Map from "./shared/Map";
import {PieChart} from "./shared/PieChart";
import {BarPlot} from "./shared/BarPlot";
import { 
  getConfiguration, 
  getSheetData, 
  // getFullSpreadsheetData,
  // getStories
} from ".././services/googleSheetsService";
import {ButtonGroupLang} from "./shared/ButtonGroup";
// import {useDataMap} from "../contexts/dataContext"
import {useYear} from "../contexts/yearContext"
import { 
  useConfiguration,   
  useDescriptions,
  // useData,
  // useSubset,
  useDataMap
 } from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";


export default function Statistics({ topic }) {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const {dataMap} = useDataMap()
  const {year} = useYear()
  const {language} = useLanguage()
  // console.log(dataMap)
  const [pieDescription, setPieDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [barDescription, setBarDescription] = useState("");
  const [stories, setStories] = useState("");
  const [opennesGroup, setOpennesGroup] = useState("All");
  const [whichSubset, setWhichSubset] = useState('All'); //Trans/Cis

  const [selectedQuestion, setSelectedQuestion] = useState("All");
// console.log('Statistics/topic', topic)
  const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие':'violence',
    'Дискриминация':'discrimination',
    'Влияние войны в Украине':'war_effects',
    'Открытость': 'opennes'
  }

  const configuration = getConfiguration()
  //   const topicsMap = {};
// configuration.forEach(topic => {
//   topicsMap[topic.name] = topic.key;
// });

// useEffect(() => {
// const [spreadsheet_id] = dataMap[year]['report']['sheet']
// },[year])


// TODO: change to fetConfiguration(language)

  useEffect(() => {
    // // console.log("Statistics/pieData:", pieData);
    // // console.log("Statistics/barData:", barData);
    // console.log("Statistics/ mapDescription:", pieDescription);
    // console.log("Statistics/ mapDescription:", barDescription);
    // console.log("Statistics/ mapDescription:", mapDescription);
    console.log('Statistics/selectedQuestion[year]: ',selectedQuestion)
    // console.log('Statistics/stories: ',stories)
}, [
  // chartData,
  //  mapDescription,
  stories,
   selectedQuestion]);

  
// TODO: change to  useDescriptions[lang]
  useEffect(() => {
    // Get row (topic) from preloaded config.xlsx/descriptions, by language (column)
    setSelectedQuestion("All");
    // setDescriptions(descr[topic])
  }, [language]);


  useEffect(() => {
    if (!configuration) {
      return; // Exit the effect if configuration is not yet available
  }
 
    getSheetData(dataMap[year]['report']['sheet'],
      topicsMap[topic]).then((res) => {
      // console.log('res:',res)
      setMapData(res)
      setPieData(parsePieData(res));
      setMapData(parseMapData(res));
      setBarData(parseBarData(res));
    });
   

  }, [topic, selectedQuestion, year, configuration]);


  const setDescriptions = (res) => {
    const relevantTopic = res.find((value) => value.name === topic);
    setBarDescription(relevantTopic?.bar);
    setPieDescription(relevantTopic?.pie);
    setMapDescription(relevantTopic?.map);
  };

  const parseBarData = (res) => {
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


  const parsePieData = (res) => {
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


  const subsetButtons = useMemo(() => {
    if (language === 'en') {
      return ['cisgender', 'transgender', 'all'];
    }
    if (language === 'ru') {
      return ['трансгендеры', 'цисгендеры', 'все'];
    }
    // default to English if the language doesn't match any known value
    return ['трансгендеры', 'цисгендеры', 'все'];
  }, [language]);

  const opennessButtons = useMemo(() => {
    if (language === 'en') {
      return ['Family', 'Friends', 'Associates'];
    }
    if (language === 'ru') {
      return ['Семья','Друзья','Учеба/работа'];
    }
    // default to English if the language doesn't match any known value
    return ['Семья','Друзья','Учеба/работа'];
  }, [language]);

  if (pieData && mapData && barData) {
    return (
      <div className="section">
        <div>
 
        <ButtonGroupLang 
          buttons={subsetButtons}
          doSomethingAfterClick = {setWhichSubset}
          />
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
          <ButtonGroupLang 
          buttons={opennessButtons}
          doSomethingAfterClick = {setOpennesGroup}/>
          {/* {opennes_group === "Открытость" ? ( */}
          <PieChart data={pieData} onArcClick={handleArcClick} />
          {/* <BarPlot data={barData} onArcClick={handleArcClick} /> */}
          </div>
        ):(
          <BarPlot data={barData} onArcClick={handleArcClick} />
        )
         }
          <p className="statistics-description">{pieDescription}</p>
        </div>
      </div>
    );
  }
}
