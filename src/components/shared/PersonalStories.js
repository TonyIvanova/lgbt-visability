import React, { useState, useEffect } from "react";
import arrow from "./../../assets/arrow.svg";
import { 
  getSheetData,
getStories,
// topicsMap, 
dataMap 
} from "../../services/googleSheetsService";
// import { useData, useDataMap } from "../../contexts/dataContext"
import { useYear } from "../../contexts/yearContext";
import { useLanguage } from "../../contexts/langContext";

export default function PersonalStories({ topic, topicsMap }) {
  // console.log('PS/topicsMap:',topicsMap)
  // console.log('Section/topic:',topic)
  const [storyIndex, setStoryIndex] = useState(null);
  const [stories, setStories] = useState([]);
  const { year, setYear } = useYear();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topicsMap) {
      return; // Do not fetch data until topicsMap is loaded
    }
    if (topicsMap[topic] === 'openness') return;
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      if (topicsMap) {
      try {
        // console.log('PersStories/topicsMap[topic]', topicsMap[topic])
        // console.log('PersStories/topicsMap[]', topicsMap)
        // console.log('PersStories/[topic]', topic)
        const stories = await getStories(year, language,topicsMap[topic]);
        
       

        if (isMounted) {
          setStories(stories);
          setStoryIndex(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [topic, language, year, topicsMap]);


  // useEffect(() => {
  //   async function fetchStories() {
  //     if (!topicsMap && !topic) {
  //       return; // Do not fetch data until topicsMap is loaded
  //     }
  //     // if (topicsMap[topic] === 'openness') return;
      
  //     // if (topicsMap && topic) {
  //       if (topicsMap[topic] === 'openness') return;

  //       console.log('PersStories/topicsMap[topic]', topicsMap[topic])
  //       console.log('PersStories/topicsMap[]', topicsMap)
  //       console.log('PersStories/[topic]', topic)
  //       const stories = await getStories(year, language,topicsMap[topic]);
        
  //       setStories(stories);
  //       setStoryIndex(0);
  //     }
  //   // }
  //   fetchStories();
  // }, [topic, language, year, topicsMap]);



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
      <div>
      <div style={{
        margin: 'auto',
        maxWidth: '800px',
        textAlign: 'left',
        marginBottom: '0px'

  }} > 
  <h2>
              {language === 'ru'
                ? `Личные истории`
                : `Personal stories`}
            </h2>
            </div>

      <div className="personal-stories-container">
        

        {getStory()}
      </div></div>
    );
  } else {
    return <></>;
  }
}
