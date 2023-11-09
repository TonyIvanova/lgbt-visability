import React, { useState, useEffect, useMemo, useCallback } from "react";
import Map from "./shared/Map";
import { PieChart } from "./shared/PieChart";
import { BarPlot } from "./shared/BarPlot";
import {
  getSections,
  getDescriptions,
  getStories,
  getConclusions,
  getConfiguration,
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
  useConfiguration,
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
  const [configuration, setConfiguration] = useState([]);
  const [mapDescription, setMapDescription] = useState('');
  const [pieDescription, setPieDescription] = useState('');
  const [barDescription, setBarDescription] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const sectionsData = await getSections(language);
        const descriptionsData = await getDescriptions(language);
        const configuration = getConfiguration(language);
        if (isMounted) {
          setSections(sectionsData);
          setDescriptions(descriptionsData, topic);
          setConfiguration(configuration);

          const mapChartDescription = descriptions.find(desc => desc.key === 'mapChartKey')?.pie || "Map Description not available";
          setMapDescription(mapChartDescription);

          const barChartDescription = descriptions.find(desc => desc.key === 'barChartKey')?.pie || "Bar Description not available";
          setBarDescription(barChartDescription);

          const pieChartDescription = descriptions.find(desc => desc.key === 'pieChartKey')?.pie || "Pie Description not available";
          setPieDescription(pieChartDescription);


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

  const [stories, setStories] = useState([]);
  const [conclusions, setConclusions] = useState([]);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const storiesData = await getStories(language);
        const conclusionsData = await getConclusions(language); // Implement this function similar to getSectionsByLanguage

        if (isMounted) {
          setStories(storiesData);
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


  // const [{ mapDescription, barDescription, pieDescription }, refreshDescriptions] = useDescriptions(topic, language);


  function getSheetName(topic, genderSubset, opennessSubset) {
    const baseName = topicsMap[topic] || "violence";
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
    async function fetchData() {
      const sheetName = getSheetName(topic, genderSubset, opennessSubset);
      console.log(sheetName);

      if ( sheetName) {
        try {
          setPieData(getPieData(sheetName));
          setMapData(getMapData(sheetName))// TODO:(parseMapData(res, selectedQuestion));
          setBarData(getBarData(sheetName));
          //TODO: get avg income data
        } catch (error) {
          console.error("Failed to get sheet data");
          console.error(error);
        }
      }
    }

    if (configuration) {
      fetchData();
    }
  }, [topic, year, genderSubset, opennessSubset, language, selectedQuestion]);



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
    if (!configuration) {
      return; // Exit the effect if configuration is not yet available
    }
    const sheetName = getSheetName(topic, genderSubset, opennessSubset);
    // console.log(sheetName);

    if (sheetName) {
      try {
        getSheetData(dataMap[year], sheetName).then(
          (res) => {
            setMapData(getMapData(year,sheetName));
            setBarData(getBarData(year,sheetName));
            setPieData(getPieData(year,sheetName));
          }
        );
      } catch (error) {
        console.error("Failed to get sheet data");
        console.error(error);
      }
    }
  }, [topic, year, genderSubset, configuration, selectedQuestion]);


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
              onButtonClick={selectOpennessSubset}
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
            onButtonClick={selectGenderSubset}
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
