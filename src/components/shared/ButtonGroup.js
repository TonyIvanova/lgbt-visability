import React, { useState } from "react";

export const ButtonGroup1 = ({ buttons, doSomethingAfterClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <div className="button-group">
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={
            // i === clickedId ? "button-secondary active" : "button-secondary"
            i === clickedId ? "button-tetriary active" : "button-tetriary"

          }
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};



export const ButtonGroup2 = ({ buttons, doSomethingAfterClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <div className="button-group">
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={
            i === clickedId ? "button-secondary active" : "button-secondary"
            // i === clickedId ? "button-tetriary active" : "button-tetriary"

          }
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};

export const ButtonGroupLang = ({ buttons, doSomethingAfterClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <div className="button-group2">
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={
            i === clickedId ? "lang active" : "lang"
          }
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};

export function ButtonGroupSubset({ buttonsConfig, onButtonClick }) {
  
    // We'll use state to keep track of which button was clicked.
    const [clickedId, setClickedId] = useState(null);
    
    return (
      <div className="button-group2">
        {buttonsConfig.map((button, i) => (
          <button 
            name={button.label}
            onClick={() => {
              onButtonClick(button.value);
              setClickedId(i);
            }}
            className={
              i === clickedId ? "lang active" : "lang"
            }
          >
            {button.label}
          </button>
        ))}
      </div>
    );
  }
  
  export function ButtonGroupOpennes({ buttonsConfig, onButtonClick }) {
  
    // We'll use state to keep track of which button was clicked.
    const [clickedId, setClickedId] = useState(null);
    
    return (
      <div className="button-group2">
        {buttonsConfig.map((button, i) => (
          <button 
            name={button.label}
            onClick={() => {
              onButtonClick(button.value);
              setClickedId(i);
            }}
            className={
              i === clickedId ? "lang active" : "lang"
            }
          >
            {button.label}
          </button>
        ))}
      </div>
    );
  }
  



// export default ButtonGroup;
