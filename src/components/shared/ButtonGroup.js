import React, { useState } from "react";

const ButtonGroup = ({ buttons, doSomethingAfterClick }) => {
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
          }
        >
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
