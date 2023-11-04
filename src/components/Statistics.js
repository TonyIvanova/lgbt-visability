import React, { useState, useEffect, useMemo } from "react";
import Map from "./shared/Map";
import { PieChart } from "./shared/PieChart";
import { BarPlot } from "./shared/BarPlot";
import {
  getConfiguration,
  getSheetData,
  // getFullSpreadsheetData,
  // getStories
} from ".././services/googleSheetsService";
import { ButtonGroupLang, ButtonGroupSubset } from "./shared/ButtonGroup";
// import {useDataMap} from "../contexts/dataContext"
import { useYear } from "../contexts/yearContext"
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
  const { dataMap } = useDataMap()
  const { year } = useYear()
  const { language } = useLanguage()
  // console.log(dataMap)
  const [pieDescription, setPieDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [barDescription, setBarDescription] = useState("");
  const [stories, setStories] = useState("");
  const [opennessGroup, setOpennessGroup] = useState("All");
  const [whichSubset, setWhichSubset] = useState('All'); //Trans/Cis

  const [selectedQuestion, setSelectedQuestion] = useState("All");
  // console.log('Statistics/topic', topic)
  const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие': 'violence',
    'Дискриминация': 'discrimination',
    'Влияние войны в Украине': 'war_effects',
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


  useEffect(() => {
    // // console.log("Statistics/pieData:", pieData);
    // // console.log("Statistics/barData:", barData);
    // console.log("Statistics/ mapDescription:", pieDescription);
    // console.log("Statistics/ mapDescription:", barDescription);
    // console.log("Statistics/ mapDescription:", mapDescription);
    console.log('Statistics/selectedQuestion[year]: ', selectedQuestion)
    // console.log('Statistics/stories: ',stories)
  }, [
    // chartData,
    //  mapDescription,
    stories,
    selectedQuestion]);


  const selectSubset = (event) => {
    setWhichSubset(event.target.name);
  };
  const selectOpennessGroup = (event) => {
    setOpennessGroup(event.target.name);
  };


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


    let sheetName = topicsMap[topic];
    if (whichSubset === 'trans') {
      sheetName += '_trans';
    } else if (whichSubset === 'cis') {
      sheetName += '_cis';
    }


    let opennessSheetName= 'openness_friends';
    if (opennessGroup === 'family') {
      sheetName += 'openness_family';
    } else if (opennessGroup === 'ass') {
      sheetName += 'openness_associates';
    }

    // Checking that we have neccessarry parameterd defined to make an API call.
    if (dataMap[year]['report']['sheet'] && sheetName) {

      getSheetData(dataMap[year]['report']['sheet'], sheetName).then((res) => {
        setMapData(res);
        setPieData(parsePieData(res));
        setMapData(parseMapData(res));
        setBarData(parseBarData(res));
      });

    }; 



  }, [
    topic,
    year,
    whichSubset,
    configuration,
    selectedQuestion,
  ]);


  const setDescriptions = (res) => {
    const relevantTopic = res.find((value) => value.name === topic);
    setBarDescription(relevantTopic?.bar);
    setPieDescription(relevantTopic?.pie);
    setMapDescription(relevantTopic?.map);
  };

  const parseBarData = (res) => {
    if (!res || res === undefined || res?.length === 0) {
      console.info("Failed to parse bar data. The response is empty.")
      return [];
    }
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
    if (!res || res === undefined || res?.length === 0) {
      console.info("Failed to parse Pie Data. Response is empty.")
      return []
    };
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
       if (!res || res === undefined || res?.length === 0) {
      console.info("Failed to parse Map Data. Response is empty.")
      return []
    };
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

  const subsetButtonsConfig = useMemo(() => {
    if (language === 'en') {
      return [
        { label: 'Cisgender', value: 'cis' },
        { label: 'Transgender', value: 'trans' },
        { label: 'All', value: 'all' }
      ];
    }
    if (language === 'ru') {
      return [
        { label: 'Трансгендеры', value: 'trans' },
        { label: 'Цисгендеры', value: 'cis' },
        { label: 'Все', value: 'all' }
      ];
    }
    // default to Russian if the language doesn't match any known value
    return [
      { label: 'Трансгендеры', value: 'trans' },
      { label: 'Цисгендеры', value: 'cis' },
      { label: 'Все', value: 'all' }
    ];
  }, [language]);



  const opennessButtonsConfig = useMemo(() => {
    if (language === 'en') {
      return [
        { label: 'Family', value: 'family' },
        { label: 'Friends', value: 'friends' },
        { label: 'Associates', value: 'ass' }
      ];
    }
    if (language === 'ru') {
      return [

        { label: 'Семья', value: 'family' },
        { label: 'Друзья', value: 'friends' },
        { label: 'Учеба/работа', value: 'ass' }
      ];
    }
    // default to Russian if the language doesn't match any known value
    return [
      { label: 'Семья', value: 'family' },
      { label: 'Друзья', value: 'friends' },
      { label: 'Учеба/работа', value: 'ass' }
    ];
  }, [language]);



  if (pieData && mapData && barData) {
    return (
      <div className="section">
        <div>



          <ButtonGroupSubset
            buttonsConfig={subsetButtonsConfig}
            onButtonClick={setWhichSubset}
          />


          {/* <Map statistics={mapData} /> */}
          <p className="statistics-description">
            {selectedQuestion !== "All"
              ? "Процент респондентов которые сталкивались с: " + ""
              : mapDescription}
         </p>   
            <h3 style={{ margin: 0 }}>
              {selectedQuestion !== "All" ? selectedQuestion : ""}
            </h3>

            <br />
          
        </div>

        <div>
          {topic === "Открытость" ? (
            <div>

              <ButtonGroupSubset
                buttonsConfig={opennessButtonsConfig}
                onButtonClick={setOpennessGroup}
              />

              <PieChart data={pieData} onArcClick={handleArcClick} />
              {/* <BarPlot data={barData} onArcClick={handleArcClick} /> */}
            </div>
          ) : (
            <BarPlot data={barData} onArcClick={handleArcClick} />
          )
          }
          <p className="statistics-description">{pieDescription}</p>
        </div>
      </div>
    );
  }
}
