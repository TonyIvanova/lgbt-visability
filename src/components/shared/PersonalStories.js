import React, { useState } from "react";
import arrow from "./../../assets/arrow.svg";

export default function PersonalStories({ stories }) {
  const [storyIndex, setStoryIndex] = useState(0);

  const onNextClick = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else if (storyIndex === stories.length - 1) {
      setStoryIndex(0);
    }
  };

  const getStory = () => {
    return (
      <div className="personal-stories">
        <div className="personal-story-card">
          <p>{stories[storyIndex].message}</p>
          <p>{stories[storyIndex].signature}</p>
        </div>

        <img src={arrow} alt="" onClick={onNextClick} style={{ width: 32 }} />
      </div>
    );
  };

  return (
    <div className="personal-stories-container">
      <h2>Истории</h2>
      {getStory()}
    </div>
  );
}
