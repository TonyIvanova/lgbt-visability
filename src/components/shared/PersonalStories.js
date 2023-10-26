import React, { useState, useEffect } from "react";
import arrow from "./../../assets/arrow.svg";
import { getSheetData, dataMap } from "../.././services/googleSheetsService";


export default function PersonalStories({ topic }) {
  const [storyIndex, setStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getSheetData(dataMap['2022']['report']['sheet'], 'df_stories').then((data) => {
      const datas = data.filter((row) => row.name === topic);
      setStories(datas);
      setStoryIndex(0);
    });
  }, [topic]);
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
