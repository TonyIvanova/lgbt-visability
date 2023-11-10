import React, { useState } from 'react';

function Expander({year}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState(''); // example state for language
//   const [year, setYear] = useState(''); // example state for year

  const toggleExpander = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ width: '960px', backgroundColor: '#f0f0f0',margin: '10 auto'}}>
      
      <button style={{ width: '960px', backgroundColor: '#f0f0f0', border:'none' }}
      onClick={toggleExpander}>

{isExpanded 
          ? <>▲ </>
          : <>▼ </>}
          
        {language === 'ru' ? 'Информация о выборке' : 'Sample Information'}
      </button>

      {isExpanded && (
        <div>
            <h2>
        {language === 'ru'
          ? `Информация о выборке за ${year} год`
          : `Sample Information for the Year ${year}`}

      </h2>
          {/* Place your plots, images, and text here */}
          <p>Content goes here...</p>
          {/* Example image */}
          <img src="path_to_your_image.jpg" alt="Description" />
          {/* More content */}
        </div>
      )}
    </div>
  );
}

export default Expander;
