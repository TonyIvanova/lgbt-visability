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
    <div style={{ width: '920px', backgroundColor: '#f0f0f0', margin: '10 auto' ,borderRadius: '5px'}}>

      <button style={{ width: '920px', height:'40px', 
        backgroundColor: '#f0f0f0', border: 'none' ,borderRadius: '5px'
        }}
        onClick={toggleExpander}>

        {isExpanded
          ? <>▲ </>
          : <>▼ </>}

        {language === 'ru' ? 'Информация о респондентах' : 'Respondents information'}
      </button>

      {isExpanded && (
        <div  style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <h3>
            {language === 'ru'
              ? `Информация о респондентах за ${year} год`
              : `Respondents Information for the year ${year}`}

          </h3>
          

          <h2>Средний возраст</h2>
          <div>

            <DistributionPlot data={data} />
          </div>

          <div style={{ padding: '20px' }} >
            <h2>
            {language === 'ru' ? 'Количество респондентов по сексуально ориентации': 'Amount of respiondents by Sexual orientation'}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={sexData} onArcClick={handleArcClick} />
            </div>
          </div>
          <div style={{ padding: '20px', align: 'center' }}>
            <h2> 
              {language === 'ru' ? 'Количество респондентов по гендеру': 'Amount of respiondents by Gender'}

            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={genderData} onArcClick={handleArcClick} />
            </div>
          </div>
         
          <div style={{ padding: '20px' }} >
            <h2>
            {language === 'ru' ? 'Количество респондентов по трансгендерности': 'Amount of respiondents by Transgenderness'}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={sexData} onArcClick={handleArcClick} />
            </div>
          </div>


          {/* Example image */}
          <img src="path_to_image.jpg" alt="Description" />
          {/* More content */}
        </div>
      )}
    </div>
  );
}

export default Expander;
