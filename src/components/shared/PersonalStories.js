import React, { useState, useEffect } from "react";
import arrow from "./../../assets/arrow.svg";
import { 
  getSheetData,
getStories,
topicsMap, 
dataMap 
} from "../../services/googleSheetsService";
// import { useData, useDataMap } from "../../contexts/dataContext"
import { useYear } from "../../contexts/yearContext";
import { useLanguage } from "../../contexts/langContext";

export default function PersonalStories({ topic }) {
  const [storyIndex, setStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);
  const { year, setYear } = useYear();
  const { language } = useLanguage();


  useEffect(() => {
    async function fetchStories() {
      if (topicsMap[topic] === 'openness') return;

      const stories = await getStories(year, language,topicsMap[topic]);
      setStories(stories);
      setStoryIndex(0);
    }
    fetchStories();
  }, [topic, language, year]);



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
