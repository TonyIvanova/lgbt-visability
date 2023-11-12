import React, { useState } from 'react';
import { getSampleData } from '../services/googleSheetsService'
import { PieChart } from './shared/PieChart';
import DistributionPlot from './shared/DistributionPlot';
function Expander({ year, data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState(''); // example state for language

  // Filter data for sex-related categories
  const sexData = data.filter(item =>
    item.key.includes('sex_')
  ).map(item => ({ name: item.key, value: parseInt(item.value, 10) }));

  // Filter data for gender-related categories
  const genderData = data.filter(item =>
    item.key.includes('gender_')
  ).map(item => ({ name: item.key, value: parseInt(item.value, 10) }));

  const toggleExpander = () => {
    setIsExpanded(!isExpanded);
  };
  const handleArcClick = (name) => {
    console.log(`Arc clicked: ${name}`);
  };

  return (
    <div style={{ width: '960px', backgroundColor: '#f0f0f0', margin: '10 auto' }}>

      <button style={{ width: '960px', backgroundColor: '#f0f0f0', border: 'none' }}
        onClick={toggleExpander}>

        {isExpanded
          ? <>▲ </>
          : <>▼ </>}

        {language === 'ru' ? 'Информация о выборке' : 'Sample Information'}
      </button>

      {isExpanded && (
        <div>
          <h3>
            {language === 'ru'
              ? `Информация о выборке за ${year} год`
              : `Sample Information for the Year ${year}`}

          </h3>
          {/* Place your plots, images, and text here */}
          {/* <p>Content goes here...</p> */}

          <h2>Средний возраст</h2>
          <div>

            <DistributionPlot data={data} />
          </div>

          <div style={{ padding: '20px' }} >
            <h2>Sex Distribution</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={sexData} onArcClick={handleArcClick} />
            </div>
          </div>
          <div style={{ padding: '20px', align: 'center' }}>
            <h2>Gender Distribution</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={genderData} onArcClick={handleArcClick} />
            </div>
          </div>
          <h4>  Rоличество по гендеру мужчины, женщины, небинарные люди, "другое"</h4>
          <h4> количество по цисгендерным и трансгендерным людям</h4>


          {/* Example image */}
          <img src="path_to_your_image.jpg" alt="Description" />
          {/* More content */}
        </div>
      )}
    </div>
  );
}

export default Expander;
