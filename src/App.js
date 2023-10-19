import "./App.css";
import { createContext, useEffect, useState } from "react";
import  getData, { getSheetData } from "./services/googleService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import loader from "./assets/loader.gif";
import ButtonGroup from "./components/shared/ButtonGroup";
import Section from "./components/Section";
import { YearProvider, useYear } from "./contexts/yearContext";
import { DataProvider, useData } from "./contexts/dataContext";


export const DataContext = createContext(null);

// function DataTable({ data, title }) {
//   if (!data || data.length === 0) return <p>No data available</p>;

//   const headers = Object.keys(data[0]);

//   return (
//     <div>
//       <h2>{title}</h2>
//       <table>
//         <thead>
//           <tr>
//             {headers.map(header => (
//               <th key={header}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, idx) => (
//             <tr key={idx}>
//               {headers.map(header => (
//                 <td key={header}>{row[header]}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


function AppContent() {
  const { data, setData } = useData();
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
  const { year, setYear } = useYear();
  const [configurationData, setConfigurationData] = useState(null); 


  //Retrieves data when the component is mounted or year changed
  useEffect(() => {
    getData(year).then(fetchedData => {
      if (!fetchedData) {
        console.error("yearData is undefined");
        return;
      }
      setData(fetchedData); //store in context
    }).catch(error => {
      console.error("Error fetching data for year:", year, error);
    });
}, [year, setData]);

// const { data } = useData();
useEffect(() => {
    if (data) {
      // Get data from 'configuration' sheet
      const configData = getSheetData(data, 'configuration');
      setConfigurationData(configData);

      if (configData) {
        //Set menu buttons sections
        setSections(configData.map((row) => row.section_title));
        setTopic(configData[0].section_title);
        console.log(configData);
      } else {
        console.error("No configuration data found for year:", year);
      }
    }
}, [data, year]);


  //// Function to update the topic state based on the name of the clicked button
  const selectTopic = (event) => {
    setTopic(event.target.name);
  };

  // Function to return the Section component with the topic as a prop
  const topicComponent = () => {
    return (
      <>
        <Section topic={topic} />
      </>
    );
  };

  // Function to update the year state
  const selectYear = (event) => {
    setYear(event.target.name);
  };

  // Conditionally render the app’s UI based on whether section data is available.
  if (sections) {
    return (

      
          <div className="App">
            <Header />
            {/* <DataTable data={configurationData} title="Configuration Data" /> */}
<h2>{sections}</h2>
            <ButtonGroup
              buttons={["2022", "2023"]}
              doSomethingAfterClick={selectYear}
            />

            {/* TODO: change data based on year picked */}

            <h1>Положение лгбт+ людей в россии на {year} год</h1>
            <ButtonGroup buttons={sections} doSomethingAfterClick={selectTopic} />
            <div className="topic-component">{topicComponent()}</div>
            {/* <DataContext.Provider value={{ data, conclusions }}> */}
            <img src={bg1} alt="" className="background-image-1"></img>
            <img src={bg2} alt="" className="background-image-2"></img>
            {/* </DataContext.Provider> */}
          </div>
       
   
    );
  } else {
    return (
      
          <div className="App">
            <Header />
            {/* <h2>{sections}</h2> */}
            <h1>Положение лгбт+ людей в россии на {year} год</h1>
            <img src={loader} alt=""></img>
            <img src={bg1} alt="" className="background-image-1"></img>
            <img src={bg2} alt="" className="background-image-2"></img>
          </div>
       

    );



  }
}

function App() {
  return (
    <YearProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </YearProvider>
  );
}

export default App;
