import React, { useState, useEffect, useMemo, useCallback } from "react";
import Map from "./shared/Map";
import { PieChart } from "./shared/PieChart";
import { BarPlot } from "./shared/BarPlot";
import {
  getSections,
  getDescriptions,
  getStories,
  getConclusions,
  // getConfiguration,
  getSheetData,
  dataMap,
  topicsMap,
  loadYearData,
  loadConfig,
  getBarData, getMapData, getPieData
} from "../services/googleSheetsService";
import { ButtonGroupLang, ButtonGroupSubset } from "./shared/ButtonGroup";
import { useYear } from "../contexts/yearContext";
import {
  // useConfiguration,
  // useDescriptions,
  // useData,

  // useSubset,
  useDataMap,
} from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";
// import { getDescriptions } from ".././services/googleSheetsService";


export default function Statistics({ topic }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { year } = useYear();
  const { language } = useLanguage();
  const [selectedQuestion, setSelectedQuestion] = useState("All");

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [opennessSubset, setOpennessSubset] = useState("All");
  const [genderSubset, setGenderSubset] = useState("All");

  const [sections, setSections] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  // const [configuration, setConfiguration] = useState([]);
  const [mapDescription, setMapDescription] = useState('');
  const [pieDescription, setPieDescription] = useState('');
  const [barDescription, setBarDescription] = useState('');

  useEffect(() => {
    if (!topicsMap) {
      return; // Do not fetch data until topicsMap is loaded
    }
  
    let isMounted = true;
    setLoading(true);
  
    const fetchData = async () => {
      try {
        const descriptionsData = await getDescriptions(language, topicsMap[topic]);
        if (isMounted) {
          setDescriptions(descriptionsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [language, topicsMap, topic]);
  
  // This useEffect will run when the descriptions state updates
  useEffect(() => {
    const mapChartDescription = descriptions.find(desc => desc.key === 'map')?.map || "Map Description not available";
    setMapDescription(mapChartDescription);
    const barChartDescription = descriptions.find(desc => desc.key === 'bar')?.bar || "Bar Description not available";
    setBarDescription(barChartDescription);
    const pieChartDescription = descriptions.find(desc => desc.key === 'pie')?.pie || "Pie Description not available";
    setPieDescription(pieChartDescription);    
  }, [descriptions]); 
  //TODO: fix it, data not filtering

  

  const [stories, setStories] = useState([]);
  const [conclusions, setConclusions] = useState([]);
  useEffect(() => {
    if (!topicsMap) {
      return; // Do not fetch data until topicsMap is loaded
    }
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        // const storiesData = await getStories(language);
        const conclusionsData = await getConclusions(year, language); 

        if (isMounted) {
          // setStories(storiesData);
          setConclusions(conclusionsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [language]);



  function getSheetName(topicKey, genderSubset, opennessSubset) {
    const baseName = topicKey || "violence";
    let sheetName = baseName;

    if (baseName === "openness") { // If the topic is 'openness'
        if (genderSubset === 'All' ) {
            sheetName += '_' + opennessSubset ; //e.g. openness_family
        }
        else{
          sheetName += '_' + opennessSubset + '_' + genderSubset; //e.g. openness_family_cis
        }
    } 
    else { // For topics other than 'openness'
        if (genderSubset !== 'All' ) {
            sheetName += '_' + genderSubset; //e.g. violence_cis
        }
        else {
          // do nothing
        }
        
    }
    console.log('sheetName', sheetName);
    return sheetName;
}

  useEffect(() => {
    if (!topicsMap) {
      return; // Exit the effect if topicsMap is not yet available
    }
  
    const fetchData = async () => {
      try {
        const sheetName = getSheetName(topic, genderSubset, opennessSubset);
        if (sheetName) {
          const mapDataResponse = await getMapData(year, sheetName);
          setMapData(mapDataResponse);
  
          const barDataResponse = await getBarData(year, sheetName);
          setBarData(Array.isArray(barDataResponse) ? barDataResponse : []);
  
          const pieDataResponse = await getPieData(year, sheetName);
          setPieData(pieDataResponse);
        }
      } catch (error) {
        console.error("Failed to get sheet data:", error);
      }
    };
  
    fetchData();
  }, [topicsMap, topic, year, genderSubset, opennessSubset, selectedQuestion]);
  

  const selectGenderSubset = (event) => {
    setGenderSubset(event.target.name);
  };
  const selectOpennessSubset = (event) => {
    setOpennessSubset(event.target.name);
  };

  useEffect(() => {
    setSelectedQuestion("All");
  }, [language]);

  
  useEffect(() => {
    // // console.log("Statistics/pieData:", pieData);
    // // console.log("Statistics/barData:", barData);
    // console.log("Statistics/ mapDescription:", pieDescription);
    // console.log("Statistics/ mapDescription:", barDescription);
    console.log("Statistics/ updated descriptions:", descriptions);
    console.log("Statistics/updated mapDescription:", mapDescription);
    console.log("Statistics/updated mapData: ", mapData);
  }, [
    mapData,
    mapDescription
  ]);

  // function useLogOnUpdate(value, label) {
  //   useEffect(() => {
  //     console.log(`${label} updated:`, value);
  //   }, [value]); // The effect runs every time 'value' changes
  // }
  // useLogOnUpdate(mapDescription, 'mapDescription');
  // useLogOnUpdate(mapData, 'mapData');


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
       {
        (topic === "Открытость" || topic === "Openness") ? (
          <div>
            <ButtonGroupSubset
              buttonsConfig={opennessButtonsConfig}
              onButtonClick={selectOpennessSubset}
            />

         
           <PieChart data={pieData} onArcClick={handleArcClick} />
           
          </div>
        ) : (
          <BarPlot data={barData} onBarClick={handleArcClick} />
        )
  }
        <p className="statistics-description">{pieDescription}</p>
      </>
    );
  };

  if (
    mapData 
    // && mapDescription
    ) {
    return (
      <div className="section">
        <div>
          <ButtonGroupSubset
            buttonsConfig={subsetButtonsConfig}
            onButtonClick={selectGenderSubset}
          />
          {mapData.length > 0 && <Map statistics={mapData} />}

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
