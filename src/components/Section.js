import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
// import { getAirtableData } from ".././services/airtableService";
import { getData, getSheetData} from ".././services/googleService";
import Statistics from "./Statistics";
import { useYear } from "../contexts/yearContext";
import { useData} from "../contexts/dataContext";

export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);
  const { year, setYear } = useYear();
  const { yearData } = useData(); 

  useEffect(() => {
    
    if(yearData) {

      const conclusionsData  = getSheetData(yearData,'conclusions')
        
        // Make sure conclusionsData is defined before trying to filter it
        if(conclusionsData) {
            setConclusions(conclusionsData.filter((row) => row.name === topic));
        } else {
            console.error("conclusionsData is undefined or null");
        }
    } else {
        console.error("Data is not available");
    }
}, [yearData, topic]);


  return (
    <div>
      <Statistics topic={topic} />
      <div className="conclusions">
        <h2>Выводы</h2>
        {conclusions.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
      </div>
      <div>
        <PersonalStories topic={topic} />
      </div>
    </div>
  );
}


// // import React, { useState, useEffect } from "react";
// import PersonalStories from "./shared/PersonalStories";
// import { getAirtableData } from ".././services/airtableService";
// import Statistics from "./Statistics";

// export default function Section({ topic }) {
//   const [conclusions, setConclusions] = useState([]);

//   useEffect(() => {
//     getAirtableData("conclusions_2022").then((data) => {
//       setConclusions(data.filter((row) => row.name === topic));
//     });
//   }, [topic]);

//   return (
//     <div>
//       <Statistics topic={topic} />
//       <div className="conclusions">
//         <h2>Выводы</h2>
//         {conclusions.map((item, index) => {
//           return <p key={index}>{item.text}</p>;
//         })}
//       </div>
//       <div>
//         <PersonalStories topic={topic} />
//       </div>
//     </div>
//   );
// }
