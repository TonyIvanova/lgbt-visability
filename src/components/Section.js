import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import {
  getSheetData,
  dataMap,
  //  topicsMap,
  getDescriptions, getConclusions,
} from "../services/googleSheetsService";
import Statistics from "./Statistics";
import {
  useDataMap,
  useDatata,
  useWhichSubset
} from "../contexts/dataContext";
import { useLanguage } from "../contexts/langContext";
import { useYear, YearProvider } from "../contexts/yearContext";

export default function Section({ topic, topicsMap }) {
  // console.log('Section/topicsMap:',topicsMap)
  const [conclusions, setConclusions] = useState([]);
  const { year, setYear } = useYear();
  const { language } = useLanguage();


  useEffect(() => {
    async function fetchConclusions() {
      try {
        const conclusionsData = await getConclusions(year, language, topicsMap[topic]);
        setConclusions(conclusionsData);
      } catch (error) {
        console.error('Failed to fetch conclusions:', error);
        setConclusions([]); // Ensure it's always an array
      }
    }
    fetchConclusions();
  }, [topic, language, year]);

  return (
    <div>
      <Statistics topic={topic} topicsMap={topicsMap} />
      <div className="conclusions">
        <h2>{language === "ru" ? `Выводы` : `Conclusions`}</h2>

        {conclusions.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
       
      </div>

{/* <div className="conclusions"> 
  <h2>
              {language === 'ru'
                ? `Истории`
                : `Stories`}
            </h2>
            </div> */}
      {topicsMap[topic] !== "openness" && (
      
          <div >

            <PersonalStories topic={topic} topicsMap={topicsMap} />
          </div>
     
      )}
    </div>
  );
}
