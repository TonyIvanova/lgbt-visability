import React, { useState } from "react";

export const ButtonGroup1 = ({ buttons, onButtonClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
    onButtonClick(event);
  };
  // console.log('Year Buttons prop:', buttons);

  if (!Array.isArray(buttons)) {
    console.error('The buttons prop must be an array.', buttons.key);
    return null; // or some fallback UI
  }

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



export const ButtonGroup2 = ({ buttons, onButtonClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
    onButtonClick(event);
  };

  return (
    <div className="button-group">
      {Array.isArray(buttons) && buttons.map((buttonLabel, i) => (
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

export const ButtonGroupLang = ({ buttons, onButtonClick }) => {
  const [clickedId, setClickedId] = useState(0);
  const buttonStyle = {
    fontSize: '1.2em', // Bigger 
    // fontWeight: '200' , // Fatter 
    textTransform: 'uppercase'
  };
  const handleClick = (event, id) => {
    setClickedId(id);
    onButtonClick(event);
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
          style={buttonStyle}
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};

export function ButtonGroupSubset({ buttonsConfig, onButtonClick,styleType, init }) {

  // We'll use state to keep track of which button was clicked.
  const initialClickedId = buttonsConfig.findIndex(button => button.value === init);

  const [clickedId, setClickedId] = useState(initialClickedId);
  const buttonStyle = {
    fontSize: '1.2em', // Bigger 
    // fontWeight: '200' , // Fatter 
    textTransform: 'uppercase'
  };
  // console.log('buttonsConfig',buttonsConfig)
  return (
    <div className={`button-group2 ${styleType}`}>
      {buttonsConfig.map((button, i) => 
      // console.log('button',button)
      (
        <button
          name={button.value}
          key={'button-' + i}
          onClick={(event) => {
            onButtonClick(event);
            setClickedId(i);
          }}
          className={
            // i === clickedId ? "lang active" : "lang"
            i === clickedId ? `lang active ${styleType}` : `lang ${styleType}`
          }

          style={buttonStyle}

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
  const buttonStyle = {
    fontSize: '1.2em', // Bigger 
    // fontWeight: '200' , // Fatter 
    textTransform: 'uppercase'
  };
  return (
    <div className="button-group2">
      {buttonsConfig.map((button, i) => (
        <button
          name={button.label}
          key={'button-' + i}
          onClick={() => {
            onButtonClick(button.value);
            setClickedId(i);
          }}
          className={
            i === clickedId ? "lang active" : "lang"
          }

          style={buttonStyle}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}




// export default ButtonGroup;
