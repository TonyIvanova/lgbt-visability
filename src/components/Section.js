import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { 
  getSheetData, 
  dataMap, topicsMap,
  getDescriptions, getConclusions,
 } from "../services/googleSheetsService";
import Statistics from "./Statistics";
import { useDataMap, useDatata, useWhichSubset } from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";
import { useYear, YearProvider } from "../contexts/yearContext";

export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);
  const { year, setYear } = useYear();
  const { language } = useLanguage();
  

  useEffect(() => {
    async function fetchConclusions() {
      const conclusions = await getConclusions(year, language);
      setConclusions(conclusions);
      // setConclusionIndex(0);
    }
    fetchConclusions();
  }, [topic, language, year]);

  return (
    <div>
      <Statistics topic={topic} />
      <div className="conclusions">
        <h2>{language === "ru" ? `Выводы` : `Conclusions`}</h2>

        {conclusions.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
      </div>

      {topicsMap[topic] !== "openness" && (
        <div>
          <PersonalStories topic={topic} />
        </div>
      )}
    </div>
  );
}
