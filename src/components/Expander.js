import React, { useState } from 'react';
import { getSampleData } from '../services/googleSheetsService'
import { PieChart } from './shared/PieChart';
import DistributionPlot from './shared/DistributionPlot';
function Expander({ year, data, language }) {
  const [isExpanded, setIsExpanded] = useState(false);
  // const [language, setLanguage] = useState(''); 
  console.log('Expander/ language',language)
  const isDataLoaded = Array.isArray(data) && data.length > 0;
  // Filter data for sex-related categories
  const sexData = data.filter(item =>
    item.key.includes('sex_')
  ).map(item => ({ key: item.key, name: item.name,  value: parseInt(item.value, 10) }));

  // Filter data for gender-related categories
  const genderData = data.filter(item =>
    item.key.includes('gender_')
  ).map(item => ({ key: item.key, name: item.name, value: parseInt(item.value, 10) }));


  const cistransData = data.filter(item =>
    item.key.includes('cistrans_')
  ).map(item => ({ key: item.key, name: item.name, value: parseInt(item.value, 10) }));


  const toggleExpander = () => {
    if (isDataLoaded) {
    setIsExpanded(!isExpanded);
    }
  };
  const handleArcClick = (name) => {
    console.log(`Arc clicked: ${name}`);
  };

  const isDataValid = Array.isArray(data) && data.every(item => item.hasOwnProperty('value'));
  if (!isDataValid) {
    return <div>Invalid sample data provided</div>;
  }


  return (

    
    <div style={{ width: '920px', backgroundColor: '#f0f0f0', margin: '10 auto' ,borderRadius: '5px'}}>

      <button style={{ width: '920px', height:'40px', 
        backgroundColor: '#f0f0f0', border: 'none' ,borderRadius: '5px'
        }}
        onClick={toggleExpander}
        disabled={!isDataLoaded} // Disabled if data is not loaded
        >

        {isExpanded
          ? <>▲ </>
          : <>▼ </>}

{language === 'ru'
              ? `Информация о респондентах за ${year} год`
              : `Respondents Information for the year ${year}`}
      </button>

      {isExpanded && (
        <div  style={{ maxHeight: '450px', overflowY: 'auto' }}>
          {/* <h3>
            {language === 'ru'
              ? `Информация о респондентах за ${year} год`
              : `Respondents Information for the year ${year}`}

          </h3> */}
          

         
          <div>
          <h2>
            {language === 'ru' ? 'Возраст': 'Age'}
            </h2>
            <DistributionPlot data={data} />
          </div>

          <div style={{ padding: '20px' }} >
            <h2>
            {language === 'ru' ? 'Количество респондентов по сексуальной ориентации': 'Amount of respondents by Sexual Orientation'}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart data={sexData} onArcClick={handleArcClick} />
            </div>
          </div>
          <div style={{ padding: '20px', align: 'center' }}>
            <h2> 
              {language === 'ru' ? 'Количество респондентов по гендеру': 'Amount of respondents by Gender'}

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
