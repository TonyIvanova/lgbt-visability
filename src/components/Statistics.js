import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useYear } from "../contexts/yearContext";
import {
  useConfiguration,
  // useDescriptions,
  // useData,
  // useSubset,
  useDataMap,
} from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";
import { getDescriptions } from ".././services/googleSheetsService";





export default function Statistics({ topic }) {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const { dataMap } = useDataMap();
  const { year } = useYear();
  const { language } = useLanguage();
  // console.log(dataMap)
  // const [pieDescription, setPieDescription] = useState("");
  // const [mapDescription, setMapDescription] = useState("");
  // const [barDescription, setBarDescription] = useState("");
  const [stories, setStories] = useState("");
  const [opennessGroup, setOpennessGroup] = useState("All");
  const [whichSubset, setWhichSubset] = useState("All"); //Trans/Cis

  const [selectedQuestion, setSelectedQuestion] = useState("All");
  // console.log('Statistics/topic', topic)
  const topicsMap = {
    "Экономическое положение": "economical_status",
    "Economical status": "economical_status",
    "Насилие": "violence",
    "Violence": "violence",
    "Дискриминация": "discrimination",
    "Discrimination": "discrimination",
    "Влияние войны в Украине": "war_effects",
    "Effects of war in Ukraine": "war_effects",
    "Открытость": "openness",
    "Openness": "openness",
  };
  const [{ mapDescription, barDescription, pieDescription }, refreshDescriptions] = useDescriptions(topic, language);
  const configuration = getConfiguration();
  

  function getSheetName(topic, whichSubset, opennessGroup) {
    const baseName = topicsMap[topic] || "default";
    let sheetName = baseName;
  
    if (whichSubset !== 'All' && opennessGroup !== 'All') {
      if (baseName === "openness") {
        sheetName += '_' + opennessGroup + '_' + whichSubset;
      } else {
        sheetName += '_' + whichSubset;
      }
    } else if (whichSubset !== 'All') {
      sheetName += '_' + whichSubset;
    } else if (opennessGroup !== 'All') {
      sheetName += '_' + opennessGroup;
    }
    
    console.log('sheetName', sheetName);
    return sheetName;
  }
  

  function useDescriptions(topic, language) {
    const [descriptions, setDescriptions] = useState({
      mapDescription: '',
      barDescription: '',
      pieDescription: ''
    });
  
    const fetchDescriptions = useCallback(async () => {
      const data = await getDescriptions(language);
      const relevantTopic = data.find((item) => item.key === topic);
      
      if (relevantTopic) {
        setDescriptions({
          mapDescription: relevantTopic.map,
          barDescription: relevantTopic.bar,
          pieDescription: relevantTopic.pie
        });
      }
    }, [topic, language]);
  
    useEffect(() => {
      fetchDescriptions();
    }, [fetchDescriptions]);
  
    // Return descriptions and a function to refresh them manually if needed
    return [descriptions, fetchDescriptions];
  }
  
  useEffect(() => {
    // // console.log("Statistics/pieData:", pieData);
    // // console.log("Statistics/barData:", barData);
    // console.log("Statistics/ mapDescription:", pieDescription);
    // console.log("Statistics/ mapDescription:", barDescription);
    // console.log("Statistics/ mapDescription:", mapDescription);
    console.log("Statistics/selectedQuestion[year]: ", selectedQuestion);
    // console.log('Statistics/stories: ',stories)
  }, [
    // chartData,
    //  mapDescription,
    stories,
    selectedQuestion,
  ]);

  //fetching data based on `topic`, `whichSubset`, `opennessGroup`, `year`, and `language`
  useEffect(() => {
    async function fetchData() {
      const sheetName = getSheetName(topic, whichSubset, opennessGroup);
      console.log(sheetName);
      
      if (dataMap[year]["report"]["sheet"] && sheetName) {
        try {
          const res = await getSheetData(dataMap[year]["report"]["sheet"], sheetName);
          setPieData(parsePieData(res));
          setMapData(parseMapData(res, selectedQuestion));
          setBarData(parseBarData(res));
        } catch (error) {
          console.error("Failed to get sheet data");
          console.error(error);
        }
      }
    }
    
    if (configuration) {
      fetchData();
    }
  }, [topic, year, whichSubset, opennessGroup, language, selectedQuestion]);


  useEffect(() => {
    // For example, refreshing descriptions when language changes
    refreshDescriptions();
  }, [language, refreshDescriptions]);

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

  

  
  
  // useEffect(() => {
        
  // }, [language]);

  
  
  useEffect(() => {
    if (!configuration) {
      return; // Exit the effect if configuration is not yet available
    }
    const sheetName = getSheetName(topic, whichSubset, opennessGroup);
    // console.log(sheetName);
    
    // Checking that we have neccessarry parameterd defined to make an API call.
    if (dataMap[year]["report"]["sheet"] && sheetName) {
      try {
        getSheetData(dataMap[year]["report"]["sheet"], sheetName).then(
          (res) => {
            // setMapData(res);
            setPieData(parsePieData(res));
            setMapData(parseMapData(res));
            setBarData(parseBarData(res));
          }
        );
      } catch (error) {
        console.error("Failed to get sheet data");
        console.error(error);
      }
    }
  }, [topic, year, whichSubset, configuration, selectedQuestion]);

  


function parseBarData(res){
  if (!res || res === undefined || res?.length === 0) {
    console.info("Failed to parse bar data. The response is empty.");
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

function parsePieData(res){
  if (!res || res === undefined || res?.length === 0) {
    console.info("Failed to parse Pie Data. Response is empty.");
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

function parseMapData(res){
  if (!res || res === undefined || res?.length === 0) {
    console.info("Failed to parse Map Data. Response is empty.");
    return [];
  }
  const result = res.map((row) => {
    return {
      name: row.District,
      value: parseFloat(row[selectedQuestion]),
    };
  });
  return result;
};



  const handleArcClick = (arcName) => {
    console.info("Handaling bar arc click ", arcName);
    setSelectedQuestion(arcName);
  };

  const subsetButtonsConfig = useMemo(() => {
    if (language === "en") {
      return [
        { label: "Cisgender", value: "cis" },
        { label: "Transgender", value: "trans" },
        { label: "All", value: "all" },
      ];
    }
    if (language === "ru") {
      return [
        { label: "Трансгендеры", value: "trans" },
        { label: "Цисгендеры", value: "cis" },
        { label: "Все", value: "all" },
      ];
    }
    // default to Russian if the language doesn't match any known value
    return [
      { label: "Трансгендеры", value: "trans" },
      { label: "Цисгендеры", value: "cis" },
      { label: "Все", value: "all" },
    ];
  }, [language]);

  const opennessButtonsConfig = useMemo(() => {
    if (language === "en") {
      return [
        { label: "Family", value: "family" },
        { label: "Friends", value: "friends" },
        { label: "Associates", value: "ass" },
      ];
    }
    if (language === "ru") {
      return [
        { label: "Семья", value: "family" },
        { label: "Друзья", value: "friends" },
        { label: "Учеба/работа", value: "ass" },
      ];
    }
    // default to Russian if the language doesn't match any known value
    return [
      { label: "Семья", value: "family" },
      { label: "Друзья", value: "friends" },
      { label: "Учеба/работа", value: "ass" },
    ];
  }, [language]);

  const charts = () => {
    return (
      <>
        {(topic === "Открытость" || topic === "Openness") ? (
          <div>
            <ButtonGroupSubset
              buttonsConfig={opennessButtonsConfig}
              onButtonClick={setOpennessGroup}
            />
            <PieChart data={pieData} onArcClick={handleArcClick} />
          </div>
        ) : (
          <BarPlot data={barData} onBarClick={handleArcClick} />
        )}
        <p className="statistics-description">{pieDescription}</p>
      </>
    );
  };
  
  if (pieData && mapData && barData) {
    return (
      <div className="section">
        <div>
          <ButtonGroupSubset
            buttonsConfig={subsetButtonsConfig}
            onButtonClick={setWhichSubset}
          />
          <Map statistics={mapData} />
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
        <div>{charts()}</div>
      </div>
    );
  }
}
