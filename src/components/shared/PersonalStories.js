import React, { useState, useEffect } from "react";
import arrow from "./../../assets/arrow.svg";
import { getSheetData } from "../../services/googleSheetsService";
import { useData, useDataMap } from "../../contexts/dataContext"
import { useYear } from "../../contexts/yearContext";
import { useLanguage } from "../../contexts/langContext";

export default function PersonalStories({ topic }) {
  const [storyIndex, setStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);
  const { dataMap } = useDataMap()
  const { year, setYear } = useYear();
  const { language } = useLanguage();

  const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие': 'violence',
    'Дискриминация': 'discrimination',
    'Влияние войны в Украине': 'war_effects',
    'Открытость': 'openness'
  }
  useEffect(() => {

    console.log('PersonaStories/stories: ', stories)
  }, [
    // chartData,
    //  mapDescription,
    stories
  ]);

  useEffect(() => {
    
    async function fetchStories() {
      if (topicsMap[topic] === 'openness') return;

      const stories = await getStories(dataMap, topic, language,year);
      setStories(stories);
      setStoryIndex(0);
    }

    async function getStories(dataMap, topic, language, year) {
      // Check that we have the sheet name
      if (!dataMap[year]["report"]["sheet"]) {
        console.info("We don't have the sheet name");
        return;
      }

      const rawData = await getSheetData(
        dataMap[year]["report"]["sheet"],
        "df_stories_filtered"
      );
      if (!rawData) {
        console.info("No stories found.");
        return [];
      }

      const mappedData = rawData.map((item) => ({
        key: item.key,
        name: item[`name_${language}`],
        text: item[`text_${language}`],
        author: item[`author_${language}`],
      }));
      return mappedData.filter((story) => story.name === topic);
    }

    fetchStories();
  }, [topic, language, year, dataMap]);



  const getStory = () => {
    return (
      <div className="personal-stories">
        <img
          src={arrow}
          className="arrow left"
          alt=""
          onClick={onPreviousClick}
          style={{ width: 24 }}
        />
        <div className="personal-story-card">
          <p>{stories[storyIndex]?.text}</p>
          <p>{stories[storyIndex]?.author}</p>
        </div>
        <img
          src={arrow}
          className="arrow"
          alt=""
          onClick={onNextClick}
          style={{ width: 24 }}
        />
      </div>
    );
  };

  const onNextClick = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else if (storyIndex === stories.length - 1) {
      setStoryIndex(0);
    }
  };

  const onPreviousClick = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    } else if (storyIndex === 0) {
      setStoryIndex(stories.length - 1);
    }
  };

  if (storyIndex != null) {
    return (
      <div className="personal-stories-container">
         <h2>
    {language === 'ru' 
        ? `Истории` 
        : `Stories`}
</h2>

        {getStory()}
      </div>
    );
  } else {
    return <></>;
  }
}
