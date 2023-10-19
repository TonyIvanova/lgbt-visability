import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import PieChart from "./shared/PieChart";
// import { getAirtableData } from ".././services/airtableService";
import { getData, getSheetData } from ".././services/googleService";
import { useYear } from "../contexts/yearContext";
import { useData } from "../contexts/dataContext";

export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [chartDescription, setChartDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("All");
  const { data } = useData(); 

  // Fetches and sets description whenever 'topic' changes
  useEffect(() => {
    setSelectedQuestion("All");
    const descriptionsData = getSheetData(data,'descriptions')
    setDescriptions(descriptionsData);
  }, [topic]);

  // Fetches and processes data for chart and map visualization when 'topic' or 'selectedQuestion' changes
  useEffect(() => {
      const res = getSheetData(data,topic);
      setChartData(parseChartData(res));
      setMapData(parseMapData(res));
    
  }, [topic, selectedQuestion]);

  //Parses and sets descriptive text for the chart and map visualizations
  const setDescriptions = (res) => {
    const relevantTopic = res.find((value) => value.Name === topic);
    setChartDescription(relevantTopic?.Pie);
    setMapDescription(relevantTopic?.Map);
  };

  // Extracts and structures data to be used in PieChart
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

  //Extracts and structures data to be used in Map
  const parseMapData = (res) => {
    //TODO:
    const result = res.map((row) => {
      return {
        name: row.District,
        value: row[selectedQuestion],
      };
    });
    return result;
  };

  //Handles user interactions on PieChart segments
  const handleArcClick = (arcName) => {
    setSelectedQuestion(arcName);
  };


  //Displays Map and PieChart when data is available,
  // otherwise loading or fallback UI can be implemented here
  if (chartData && mapData) {
    return (
      <div className="section">
        <div>
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
          <PieChart data={chartData} onArcClick={handleArcClick} />
          <p className="statistics-description">{chartDescription}</p>
        </div>
      </div>
    );
  }
}
