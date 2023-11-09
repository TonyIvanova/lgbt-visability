import React, { useState, useEffect, useMemo, useCallback } from "react";
import Map from "./shared/Map";
import { PieChart } from "./shared/PieChart";
import { BarPlot } from "./shared/BarPlot";
import {
  getSectionsByLanguage,
  getDescriptionsByLanguage,
  getStoriesByLanguage,
  getConclusionsByLanguage,
  getConfigurationByLanguage,
  getSheetData,
  dataMap,
  topicsMap,
  loadYearData,
  loadConfig
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
import { getDescriptions } from ".././services/googleSheetsService";


export default function Statistics({ topic }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { year } = useYear();
  const { language } = useLanguage();
  const [selectedQuestion, setSelectedQuestion] = useState("All");

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [opennessGroup, setOpennessGroup] = useState("All");
  const [whichSubset, setWhichSubset] = useState("All");

  const [sections, setSections] = useState([]);
  // const [topic, setTopic] = useState([]);
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
        const sectionsData = await getSectionsByLanguage(language);
        const descriptionsData = await getDescriptionsByLanguage(language);
        const configuration = getConfigurationByLanguage(language);
        if (isMounted) {
          setSections(sectionsData);
          setDescriptions(descriptionsData);
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
        const storiesData = await getStoriesByLanguage(language);
        const conclusionsData = await getConclusionsByLanguage(language); // Implement this function similar to getSectionsByLanguage

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


  // function useDescriptions(topic, language) {

  //   const fetchDescriptions = useCallback(async () => {
  //     const relevantTopic = descriptions.find((item) => item.key === topic);

  //     if (relevantTopic) {
  //       setDescriptions({
  //         mapDescription: relevantTopic.map,
  //         barDescription: relevantTopic.bar,
  //         pieDescription: relevantTopic.pie
  //       });
  //     }
  //   }, [topic, language]);


  //   useEffect(() => {
  //     fetchDescriptions();
  //   }, [fetchDescriptions]);

  //   // Return descriptions and a function to refresh them manually if needed
  //   return [descriptions, fetchDescriptions];
  // }


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




  function parseBarData(res) {
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

  function parsePieData(res) {
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

  function parseMapData(res) {
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
