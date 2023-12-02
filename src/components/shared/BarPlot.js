import React, { useRef } from "react";
import * as d3 from "d3";
import styles from "./bar-plot.module.css";

export function BarPlot({ data, language, onBarClick = () => {} }) {
  const handleBarClick = (name) => {
    onBarClick(name);
    console.info("Clicked bar with name ", name); 
  };

  // Setup barplot
  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const colorScale = d3.scaleOrdinal(d3.schemeAccent);

  // band scale for categorical data
  const xScale = d3.scaleBand().domain(data.map(d => d.name)).range([0, width]).padding(0.1);
 // linear scale for numerical data
  const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([height, 0]);


  const ref = useRef(null);

  const xAxisLabel = language === 'en' ? "Subcategories" : "Подкатегории";
  const yAxisLabel = language === 'en' ? "Count" : "Количество случаев";


 

  // Create bars based on data
  const bars = data.map((d, i) => {
    return (
      <g
        key={i}
        className={styles.bar}
        onClick={() => handleBarClick(d.name)}
        onMouseEnter={() => {
            if (ref.current) {
              ref.current.classList.add(styles.hasHighlight);
            }
          }}
          onMouseLeave={() => {
            if (ref.current) {
              ref.current.classList.remove(styles.hasHighlight);
            }
          }}
      >
        <rect
          x={xScale(d.name)}
          y={yScale(d.value)}
          width={xScale.bandwidth()}
          height={height - yScale(d.value)}
          fill={colorScale(d.value)}
        />
      </g>
    );
  });

   // Create legend 
  const legend = data.map((d, i) => {
    return (
      <div className={styles.legendText} 
      key={i}
      >
        <div
          style={{
            background: colorScale(d.value),
            width: 10,
            height: 10,
            borderRadius: 10,
          }}
        ></div>
        {d.name}
      </div>
    );
  });

  
  //show
  return (
    <div className={styles.barChart}>
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {bars}
          <g
            transform={`translate(0,${height})`}
            // ref={node => d3.select(node).call(d3.axisBottom(xScale))}
          />
          <g ref={node => d3.select(node).call(d3.axisLeft(yScale))} />
         
           <text
            transform={`translate(${width / 2}, ${height + margin.bottom - 5})`}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <text
            transform={`rotate(-90)`}
            x={-height / 2}
            y={-margin.left + 15}
            textAnchor="middle"
          >
            {yAxisLabel}
          </text>

        </g>
      </svg>
      <div className={styles.legendContainer}>{legend}</div>
      
    </div>
  );
}
