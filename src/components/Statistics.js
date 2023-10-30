import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import {PieChart,PieChart2} from "./shared/PieChart";
import { getSheetData } from ".././services/googleSheetsService";
import {ButtonGroupLang} from "./shared/ButtonGroup";
import {useDataMap} from "../contexts/dataContext"


export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const {dataMap} = useDataMap()
  const [chartDescription, setChartDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("All");
  const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие':'violence',
    'Дискриминация':'discrimination',
    'Влияние войны в Украине':'map_wareffect',
    'Открытость': 'opennes'
  }
  useEffect(() => {
    setSelectedQuestion("All");
    getSheetData(dataMap['2022']['report']['sheet'], 'descriptions').then((res) => {
      setDescriptions(res);
    });
  }, [topic]);

  useEffect(() => {
    getSheetData(dataMap['2022']['report']['sheet'], topicsMap[topic]).then((res) => {
      setChartData(parseChartData(res));
      setMapData(parseMapData(res));
    });
  }, [topic, selectedQuestion]);

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

          
        <ButtonGroupLang buttons={['| Cis','|  Trans  |','All |']}/>
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
