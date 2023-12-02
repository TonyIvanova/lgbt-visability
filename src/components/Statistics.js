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
  // topicsMap,
  loadYearData,
  loadConfig,
  getBarData, getMapData, getPieData, getIncomeData
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


export default function Statistics({ topic, topicsMap }) {
  // console.log('STATISTICS/topicsMap:',topicsMap)
  // console.log('STATISTICS/topic:',topic)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { year } = useYear();
  const { language } = useLanguage();
  const [selectedQuestion, setSelectedQuestion] = useState("All");

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [opennessSubset, setOpennessSubset] = useState("family");
  const [genderSubset, setGenderSubset] = useState("all");

  const [sections, setSections] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  // const [configuration, setConfiguration] = useState([]);
  const [mapDescription, setMapDescription] = useState('');
  const [pieDescription, setPieDescription] = useState('');
  const [barDescription, setBarDescription] = useState('');


  // const [stories, setStories] = useState([]);
  const [conclusions, setConclusions] = useState([]);

  // Get all descriptions for language
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


  // Parse map/bar/pie descriptions
  useEffect(() => {
    const currentTopicDescription = descriptions.find(desc => desc.key === topicsMap[topic]);

    const mapChartDescription = currentTopicDescription?.map || "Map Description not available";
    setMapDescription(mapChartDescription);
    const barChartDescription = currentTopicDescription?.bar || "Bar Description not available";
    setBarDescription(barChartDescription);
    const pieChartDescription = currentTopicDescription?.pie || "Pie Description not available";
    setPieDescription(pieChartDescription);
  }, [descriptions, topicsMap, topic]);



  // Get conclusions by language & year
  useEffect(() => {
    if (!topicsMap) {
      return; // Do not fetch data until topicsMap is loaded
    }
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      if (topicsMap) {
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
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [language]);


  // Generate a sheetName given selections
  function getSheetName(topicKey, genderSubset, opennessSubset) {
    const baseName = topicKey || "violence";
    let sheetName = baseName;

    // console.log('baseName:',baseName)
    if (baseName === "openness") { // If the topic is 'openness'
      if (genderSubset === 'all') {
        sheetName += '_' + opennessSubset; //e.g. openness_family
      }
      else {
        sheetName += '_' + opennessSubset + '_' + genderSubset; //e.g. openness_family_cis
      }
    }
    else { // For topics other than 'openness'
      if (genderSubset !== 'all') {
        sheetName += '_' + genderSubset; //e.g. violence_cis
      }
      else {
        // do nothing
      }

    }
    // console.log('sheetName', sheetName);
    return sheetName;
  }

  // Get data given topic, subsets, year & selectedQuestion 
  useEffect(() => {
    if (!topicsMap) {
      return; // Exit the effect if topicsMap is not yet available
    }

    const fetchData = async () => {
      try {
        const sheetName = getSheetName(topicsMap[topic], genderSubset, opennessSubset);
        if (sheetName) {
          const mapDataResponse = await getMapData(year, language, sheetName, selectedQuestion, topicsMap[topic]);
          // console.log('Fetched mapData:', mapDataResponse);
          setMapData(mapDataResponse);

          const barDataResponse = await getBarData(year, language, sheetName, selectedQuestion);
          setBarData(Array.isArray(barDataResponse) ? barDataResponse : []);
          // console.log('statistics /pre pie language:', language)
          const pieDataResponse = await getPieData(year, language, sheetName, selectedQuestion);
          setPieData(pieDataResponse);

          const incomeDataResponse = await getIncomeData(year, language, genderSubset);
          setIncomeData(incomeDataResponse);

        }

      } catch (error) {
        console.error("Failed to get sheet data:", error);
      }
    };
    // console.log('STATISTICS/ fetchData/ Current selectedQuestion:', selectedQuestion);
    fetchData();
  }, [
    topicsMap,
    topic,
    year,
    genderSubset,
    opennessSubset,
    selectedQuestion,
    language
  ]);


  const selectGenderSubset = (event) => {
    setGenderSubset(event.target.name);
  };
  const selectOpennessSubset = (event) => {
    setOpennessSubset(event.target.name);
  };

  useEffect(() => {
    setSelectedQuestion("All");
  }, [language]);


  const handleArcClick = (arcName) => {
    // console.info("STATISTICS/Handling bar arc click ", arcName);
    setSelectedQuestion(arcName);
  };

  useEffect(() => {
    // // console.log("Statistics/pieData:", pieData);
    // // console.log("Statistics/barData:", barData);
    // console.log("Statistics/ mapDescription:", pieDescription);
    // console.log("Statistics/ mapDescription:", barDescription);
    // console.log("Statistics/ updated descriptions:", descriptions);
    // // console.log("Statistics/updated mapDescription:", mapDescription);
    // console.log("Statistics/updated mapData: ", mapData);
    // console.log("Statistics/updated selectedQuestion: ", selectedQuestion);
    // console.log("Statistics/updated opennessSubset: ", opennessSubset);
    // console.log("Statistics/updated genderSubset: ", genderSubset);
    // console.log("Statistics/updated incomeData: ", incomeData);
  }, [
    mapData,
    mapDescription,
    selectedQuestion,
    genderSubset, opennessSubset,
    incomeData
  ]);

  // function useLogOnUpdate(value, label) {
  //   useEffect(() => {
  //     console.log(`${label} updated:`, value);
  //   }, [value]); // The effect runs every time 'value' changes
  // }
  // useLogOnUpdate(mapDescription, 'mapDescription');
  // useLogOnUpdate(mapData, 'mapData');



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
        { label: "Трансгендерные люди", value: "trans" },
        { label: "Цисгендерные люди", value: "cis" },
        { label: "Все", value: "all" },
      ];
    }
    // default to Russian if the language doesn't match any known value
    return [
      { label: "Трансгендерные люди", value: "trans" },
      { label: "Цисгендерные люди", value: "cis" },
      { label: "Все", value: "associates" },
    ];
  }, [language]);

  const opennessButtonsConfig = useMemo(() => {
    if (language === "en") {
      return [
        { label: "Family", value: "family" },
        { label: "Friends", value: "friends" },
        { label: "Associates", value: "associates" },
      ];
    }
    if (language === "ru") {
      return [
        { label: "Семья", value: "family" },
        { label: "Друзья", value: "friends" },
        { label: "Учеба/работа", value: "associates" },
      ];
    }
    //TODO: move to service & populate from Config gsheet

    // default to Russian if the language doesn't match any known value
    return [
      { label: "Семья", value: "family" },
      { label: "Друзья", value: "friends" },
      { label: "Учеба/работа", value: "associates" },
    ];
  }, [language]);

  const charts = () => {
    return (
      <>
        {
          (topicsMap[topic] === 'openness' ? (
            // <div>
            <div className="charts-section">
              <h2>{language === "ru" ? `Результаты по вариантам ответов` : `Results by response option`}</h2>
              <PieChart data={pieData} onArcClick={handleArcClick} topicKey={topicsMap[topic]} />
              <p className="statistics-description">{pieDescription}</p>
            </div>
          ) : topicsMap[topic] === "economical_status" ? (
            // <div>
            <div className="charts-section">
              <h2>{language === "ru" ? `Результаты по вопросам в категории` : `Results by questions in category`}</h2>
              <BarPlot data={barData} onBarClick={handleArcClick} language={language}/>
              <p className="statistics-description">{barDescription}</p>
              <h2>{language === "ru" ? `Средний доход по всем округам` : `Average income accross all districts`}</h2>
              <PieChart data={incomeData} topicKey={topicsMap[topic]} />
              <p className="statistics-description">{pieDescription}</p>
            </div>
          ) : (
            // Default case for other topics
            // <div>
            <div className="charts-section">
              <h2>{language === "ru" ? `Результаты по вопросам в категории` : `Results by questions in category`}</h2>
              <BarPlot data={barData} onBarClick={handleArcClick} />
              <p className="statistics-description">{barDescription}</p>
            </div>
          ))
        }


      </>
    );
  };

  if (
    mapData
    && mapDescription
    //&& selectedQuestion
  ) {
    return (
      <div className="section">
        <div>

          <ButtonGroupSubset
            buttonsConfig={subsetButtonsConfig}
            onButtonClick={selectGenderSubset}
            styleType="gender-style"
            init={genderSubset}
          />
          {topicsMap[topic] === "openness" && (
            <ButtonGroupSubset
              buttonsConfig={opennessButtonsConfig}
              onButtonClick={selectOpennessSubset}
              styleType="openness-style"
              init='family'
            />
          )}
          {
            // mapData.length > 0 
            // && 
            <div className="map-section">
              <h2>{language === "ru" ? `Результаты по федеральным округам` : `Resuls by federal district`}</h2>
              <Map statistics={mapData} />
              <div>
          <p className="statistics-description">
            {mapDescription}
            {topicsMap[topic] !== 'openness' && (
              <strong>
                {selectedQuestion !== "All" ? (
                  language === 'ru'
                    ? `На карте отображены результаты подкатегории ${selectedQuestion}. `
                    : `The map displays results for the subcategory ${selectedQuestion}. `
                ) : (
                  language === 'ru'
                    ? `На карте отображены результаты сумарно по всем подкатегориям.`
                    : `The map displays results across all subcategories.`
                )}
              </strong>
            )}
          </p>
          </div>

            </div>
          }

         


          {/* <h3 style={{ margin: 0 }}>
            {selectedQuestion !== "All" ? selectedQuestion : ""}
          </h3> */}
          <br />
        </div>
        <div>{charts()}</div>
      </div>
    );
  }
}
