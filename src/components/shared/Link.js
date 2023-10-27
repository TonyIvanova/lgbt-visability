import React, { useState } from "react";

export const Link = ({ year, href }) => {
  

  return (
    <div className="link">
       <a
          href={href}
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h4>Ссылка на полную версию отчета за {year} год </h4>
        </a>
    </div>
  );
};

