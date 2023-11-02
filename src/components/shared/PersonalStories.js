import React, { useState, useEffect } from "react";
import arrow from "./../../assets/arrow.svg";
import { getSheetData } from "../../services/googleSheetsService";
import { useData, useDataMap } from "../../contexts/dataContext"
import { useYear } from "../../contexts/yearContext";
import { useLanguage } from "../../contexts/langContext";

export default function PersonalStories({ topic }) {
  const [storyIndex, setStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);
  const {dataMap} = useDataMap()
  const {year, setYear} = useYear();
  const { language } = useLanguage();


  useEffect(() => {
   
    console.log('PersonaStories/stories: ',stories)
}, [
  // chartData,
  //  mapDescription,
  stories
  ]);

  useEffect(() => {
    async function fetchStories() {
      const stories = await getStories(dataMap, topic, language);
      setStories(stories);
      setStoryIndex(0);
    }
  
    async function getStories(dataMap, topic, language = 'ru') {
      const rawData = await getSheetData(dataMap[year]['report']['sheet'], 'df_stories_filtered');
      console.log('rawData',rawData)
      const mappedData = rawData.map(item => ({
        key: item.key,
        name: item[`name_${language}`],
        text: item[`text_${language}`],
        author: item[`author_${language}`]
      }));
      console.log('mappedData',mappedData)
      return mappedData.filter(story => story.name === topic);
  
    }
  
    fetchStories();
    console.log('stories:::',stories)
  }, [topic, language, year, dataMap]);
  

  
// useEffect(() => {
//   getSheetData(data, 'df_stories_filtered').then((dat) => {
//     const datas = dat.filter((row) => row.name === topic && row.language === language); // filtering based on language
//     setStories(datas);
//     setStoryIndex(0);
//   });
//   console.log('Stories: ',stories)
// }, [topic, language]); 

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
          <p>{stories[storyIndex].text}</p>
          <p>{stories[storyIndex].author}</p>
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
        <h2 className="container">Истории</h2>
        {getStory()}
      </div>
    );
  } else {
    return <></>;
  }
}
