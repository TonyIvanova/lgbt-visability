import React, {useState, useEffect} from "react";
import logo from "./../assets/logo.svg";
import {ButtonGroupLang} from "./shared/ButtonGroup";
import { useLanguage } from '../contexts/langContext';
import { getBannerData } from "../services/googleSheetsService";


export default function Header() {
  const {language, setLanguage} = useLanguage(); 
  const Banner = ({ year, link }) => {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="banner">
        <div>
      
          {language === 'ru'
            ? `Участвовать  в исследовании ${year} года`
            : `  Participate in the ${year} survey`}
      
          </div>
      </a>
    );
  };
  
    const [banner, setBanner] = useState(null);
  
    useEffect(() => {
      getBannerData().then(setBanner);
    }, []);
  
    if (!banner || banner.status !== 'on') {
      return null; // Don't display if no active config
    }
  
  
  
  const changeLanguage = (event) => {
    console.log(event.target.name);
    setLanguage(event.target.name);
  };

  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div className="App-header-logo">
    <img src={logo} alt="Logo" />
  </div>

  <Banner year={banner.year} link={banner.link}/>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ButtonGroupLang buttons={['ru','en']} onButtonClick={changeLanguage} />

    <div className="header-buttons-container" style={{ marginLeft: '20px' }}> {/* Adjust marginLeft as needed */}
      <a
        href="https://comingoutspb.com/we-are-helping/"
        className="button-secondary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {language === 'ru' ? 'Нужна помощь' : 'Need Help'}
      </a>
      <a
        href="https://comingoutspb.org/support/"
        className="button-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {language === 'ru' ? 'Хочу помочь' : 'Want to Help'}
      </a>
    </div>
  </div>
</header>

  );
}
