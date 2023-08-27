import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import PieChart from "./shared/PieChart";
import { getAirtableData } from ".././services/airtableService";

export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [chartDescription, setChartDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("All");

  useEffect(() => {
    getAirtableData("descriptions").then((res) => {
      setDescriptions(res);
    });
  }, [topic]);

  useEffect(() => {
    getAirtableData(topic).then((res) => {
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
      return { name: field, value: values[field] };
    });
    return result;
  };

  const parseMapData = (res) => {
    const result = res.map((row) => {
      return {
        name: row.District,
        value: row[selectedQuestion],
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
          <Map statistics={mapData} />
          <p className="statistics-description">
            {selectedQuestion !== "All"
              ? "Процент респондентов ответивших Да относительно количества ответов по региону на вопрос: " +
                selectedQuestion
              : mapDescription}
            <br />
          </p>
        </div>
        <div>
          <PieChart data={chartData} onArcClick={handleArcClick} />
          <p className="statistics-description">{chartDescription}</p>
        </div>
      </div>
    );
  }
}
