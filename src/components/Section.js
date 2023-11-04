import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { getSheetData, fetchDataMap } from "../services/googleSheetsService";
import Statistics from "./Statistics";
import {
  useDataMap,
  useDatata,
  useWhichSubset
} from "../contexts/dataContext"
import {
  useLanguage
} from "../contexts/langContext"
import { useYear, YearProvider } from "../contexts/yearContext";


export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);
  const {year, setYear} = useYear();
  const {dataMap} = useDataMap()
  const {language} = useLanguage()
  const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие': 'violence',
    'Дискриминация': 'discrimination',
    'Влияние войны в Украине': 'war_effects',
    'Открытость': 'openness'
  }


  useEffect(() => {
    async function fetchConclusions() {
      const conclusions = await getConclusions(dataMap, topic, language);
      setConclusions(conclusions);
      // setConclusionIndex(0);
    }

    async function getConclusions(dataMap, topic, language) {
      const rawData = await getSheetData(
        dataMap[year]["report"]["sheet"],
        "conclusions"
      );
      if (!rawData) {
        console.info("No Conclusions found.");
        return [];
      }
      const mappedData = rawData.map((item) => ({
        key: item.key,
        name: item[`name_${language}`],
        text: item[`text_${language}`],
      }));
      return mappedData.filter((story) => story.name === topic);
    }

    fetchConclusions();
  }, [topic, language, year, dataMap]);

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
