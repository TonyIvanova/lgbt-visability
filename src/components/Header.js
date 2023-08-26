import React from "react";
import logo from "./../assets/logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="App-header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div class="header-buttons-container">
        <a
          href="https://comingoutspb.com/we-are-helping/"
          className="button-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Нужна помощь
        </a>
        <a
          href="https://comingoutspb.org/support/"
          className="button-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Хочу помочь
        </a>
      </div>
    </header>
  );
}
